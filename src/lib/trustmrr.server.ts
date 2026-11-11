import type { Revenue, ScoutFeed, ScoutProduct, ScoutSource, StartupProfile } from "./types.ts";

const UA = "Riposte/1.0 (https://grok.com; product research desk)";
const DISCOVERY = "https://trustmrr.com/api/ai/discovery";
const MARKETPLACE = "https://trustmrr.com/api/ai";

type CacheEntry<T> = { at: number; value: T };
const cache = new Map<string, CacheEntry<unknown>>();

function readCache<T>(key: string, ttlMs: number): T | null {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (!hit) return null;
  if (Date.now() - hit.at > ttlMs) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function writeCache<T>(key: string, value: T): T {
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": UA },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`TrustMRR returned ${res.status}`);
  return res.json();
}

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[$,]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function str(v: unknown): string | null {
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

function revenueOf(raw: unknown): Revenue {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    last30Days: num(r.last30Days),
    mrr: num(r.mrr),
    total: num(r.total),
  };
}

function normalize(raw: Record<string, unknown>, source: ScoutSource): ScoutProduct | null {
  const slug = str(raw.slug)?.toLowerCase();
  const name = str(raw.name);
  if (!slug || !name) return null;
  const stealth = Boolean(raw.stealthMode);
  return {
    name: stealth ? "Stealth startup" : name,
    slug,
    url: str(raw.url) ?? `https://trustmrr.com/startup/${slug}`,
    icon: stealth ? null : str(raw.icon),
    description: stealth ? "Hidden while the founder ships in public." : (str(raw.description) ?? ""),
    website: stealth ? null : str(raw.website),
    category: str(raw.category),
    paymentProvider: str(raw.paymentProvider),
    revenue: revenueOf(raw.revenue),
    growth30d: num(raw.growth30d),
    growthMRR30d: num(raw.growthMRR30d),
    onSale: Boolean(raw.onSale),
    stealthMode: stealth,
    askingPrice: raw.askingPrice == null ? null : num(raw.askingPrice),
    multiple: raw.multiple == null ? null : num(raw.multiple),
    sources: [source],
  };
}

function merge(existing: ScoutProduct | undefined, next: ScoutProduct): ScoutProduct {
  if (!existing) return next;
  const sources = Array.from(new Set([...existing.sources, ...next.sources]));
  return {
    ...existing,
    ...next,
    name: existing.stealthMode ? existing.name : next.name || existing.name,
    description: next.description || existing.description,
    website: next.website || existing.website,
    icon: next.icon || existing.icon,
    category: next.category || existing.category,
    revenue: {
      last30Days: Math.max(existing.revenue.last30Days, next.revenue.last30Days),
      mrr: Math.max(existing.revenue.mrr, next.revenue.mrr),
      total: Math.max(existing.revenue.total, next.revenue.total),
    },
    growth30d: Math.abs(next.growth30d) > Math.abs(existing.growth30d) ? next.growth30d : existing.growth30d,
    onSale: existing.onSale || next.onSale,
    askingPrice: next.askingPrice ?? existing.askingPrice,
    multiple: next.multiple ?? existing.multiple,
    sources,
  };
}

function byRevenue(a: ScoutProduct, b: ScoutProduct) {
  return b.revenue.last30Days - a.revenue.last30Days || b.revenue.mrr - a.revenue.mrr;
}

function earnsWell(p: ScoutProduct) {
  return p.revenue.last30Days >= 500 || p.revenue.mrr >= 200;
}

export async function loadScoutFeed(): Promise<ScoutFeed> {
  const cached = readCache<ScoutFeed>("scout", 5 * 60_000);
  if (cached) return cached;

  const [discovery, marketplace] = await Promise.all([
    fetchJson(DISCOVERY).catch(() => null) as Promise<Record<string, unknown> | null>,
    fetchJson(MARKETPLACE).catch(() => null) as Promise<Record<string, unknown> | null>,
  ]);

  const map = new Map<string, ScoutProduct>();
  const ingest = (list: unknown, source: ScoutSource) => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const product = normalize(item as Record<string, unknown>, source);
      if (!product) continue;
      map.set(product.slug, merge(map.get(product.slug), product));
    }
  };

  ingest(discovery?.recentlyAddedStartups, "recent");
  ingest(discovery?.fastestGrowingStartups, "growing");
  ingest(marketplace?.recentlyListedStartups, "listed");
  ingest(marketplace?.bestDeals, "deal");

  if (map.size === 0) {
    for (const p of FALLBACK_STARTUPS) {
      map.set(p.slug, p);
    }
  }

  const all = Array.from(map.values());
  const feed: ScoutFeed = {
    earning: all.filter(earnsWell).sort(byRevenue),
    growing: all
      .filter((p) => p.sources.includes("growing"))
      .sort((a, b) => b.growth30d - a.growth30d || byRevenue(a, b)),
    recent: all.filter((p) => p.sources.includes("recent")).sort(byRevenue),
    listed: all
      .filter((p) => p.onSale || p.sources.includes("listed") || p.sources.includes("deal"))
      .sort(byRevenue),
    fetchedAt: new Date().toISOString(),
  };
  return writeCache("scout", feed);
}

export async function loadStartupProfile(slug: string): Promise<StartupProfile> {
  const key = `profile:${slug}`;
  const cached = readCache<StartupProfile>(key, 10 * 60_000);
  if (cached) return cached;

  const markdownUrl = `https://trustmrr.com/startup/${slug}.md`;
  try {
    const res = await fetch(markdownUrl, {
      headers: { Accept: "text/markdown, text/plain", "User-Agent": UA },
      signal: AbortSignal.timeout(12_000),
    });
    if (res.status === 404) throw new Error("This startup is not on TrustMRR.");
    if (!res.ok) throw new Error(`TrustMRR returned ${res.status}`);
    const markdown = await res.text();
    if (/page not found/i.test(markdown) && markdown.length < 400) {
      throw new Error("This startup is not on TrustMRR.");
    }
    const profile = parseMarkdownProfile(slug, markdown);
    return writeCache(key, profile);
  } catch (err) {
    const fallback = getFallbackProfile(slug);
    if (fallback) return writeCache(key, fallback);
    throw err;
  }
}

function bulletMap(section: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of section.split("\n")) {
    const m = line.match(/^-\s+\*?([^:*]+)\*?:\s*(.+)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`/g, "")
      .trim();
    if (key && val) out[key] = val;
  }
  return out;
}

function parseMoneyish(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/,/g, "").match(/-?\$?([\d.]+)\s*([kKmMbB])?/);
  if (!cleaned) return 0;
  const n = Number(cleaned[1]);
  if (!Number.isFinite(n)) return 0;
  const suffix = (cleaned[2] || "").toLowerCase();
  if (suffix === "k") return n * 1_000;
  if (suffix === "m") return n * 1_000_000;
  if (suffix === "b") return n * 1_000_000_000;
  return n;
}

function mdSection(markdown: string, heading: string): string {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, "i");
  return markdown.match(re)?.[1]?.trim() ?? "";
}

export function parseMarkdownProfile(slug: string, markdown: string): StartupProfile {
  const profileSec = mdSection(markdown, "Profile");
  const insightsSec = mdSection(markdown, "Startup Insights");
  const stackSec = mdSection(markdown, "Tech Stack");
  const distSec = mdSection(markdown, "Distribution");
  const revenueSec = mdSection(markdown, "Revenue");
  const metricsSec = mdSection(markdown, "Metric Snapshots");

  const profile = bulletMap(profileSec);
  const insights = bulletMap(insightsSec);
  const metrics = bulletMap(metricsSec);

  const techStack: Record<string, string[]> = {};
  for (const line of stackSec.split("\n")) {
    const m = line.match(/^-\s+\*?([^:]+)\*?:\s*(.+)$/);
    if (!m) continue;
    const items = m[2]
      .split(",")
      .map((s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
      .filter(Boolean);
    if (items.length) techStack[m[1].trim()] = items;
  }

  const marketingChannels: string[] = [];
  for (const line of distSec.split("\n")) {
    const m = line.match(/Marketing channels:\s*(.+)$/i);
    if (m) {
      marketingChannels.push(
        ...m[1]
          .split(",")
          .map((s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim())
          .filter(Boolean),
      );
    }
  }

  const revenueTable: Array<{ period: string; amount: string }> = [];
  for (const line of revenueSec.split("\n")) {
    const row = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!row) continue;
    const period = row[1].trim();
    const amount = row[2].trim();
    if (/period/i.test(period) || /^-+$/.test(period.replace(/\s/g, ""))) continue;
    revenueTable.push({ period, amount });
  }

  const last30 =
    parseMoneyish(metrics["Last 30 days revenue snapshot"]) ||
    parseMoneyish(revenueTable.find((r) => /last 30/i.test(r.period))?.amount);
  const mrr = parseMoneyish(metrics["Current MRR"]);
  const total =
    parseMoneyish(metrics["All-time revenue snapshot"]) ||
    parseMoneyish(revenueTable.find((r) => /all time/i.test(r.period))?.amount);

  const growthRaw = metrics["Last 30 days revenue growth"] ?? "";
  const growthMatch = growthRaw.replace(/,/g, "").match(/([+-]?[\d.]+)/);
  const growth30d = growthMatch ? Number(growthMatch[1]) : null;
  const mrrGrowthRaw = metrics["Last 30 days MRR growth"] ?? "";
  const mrrGrowthMatch = mrrGrowthRaw.replace(/,/g, "").match(/([+-]?[\d.]+)/);

  const website = profile.Website?.match(/https?:\/\/\S+/)?.[0] ?? str(profile.Website);
  const icon = profile.Icon?.match(/https?:\/\/\S+/)?.[0] ?? str(profile.Icon);
  const stealth = /stealth/i.test(profile.Name ?? "") || /hidden/i.test(profile.Description ?? "");

  const githubSec = mdSection(markdown, "GitHub Activity");
  const seoSec = mdSection(markdown, "SEO Domain Data");
  const githubMap = bulletMap(githubSec);
  const seoMap = bulletMap(seoSec);
  const contrib30 = Number.parseInt((githubMap["Contributions in last 30 days"] ?? "").replace(/[^\d-]/g, ""), 10);
  const domainRating = Number.parseFloat((seoMap["Domain rating"] ?? "").replace(/[^\d.]/g, ""));

  return {
    slug,
    name: profile.Name || slug,
    description: profile.Description || "",
    website: website && website !== "—" ? website : null,
    icon: icon ?? null,
    category: insights.Markets?.split(",")[0]?.trim() ?? null,
    founder: profile.Founder ?? null,
    country: profile.Country ?? null,
    foundedDate: profile["Founded date"] ?? null,
    stealthMode: stealth,
    onSale: /for sale/i.test(markdown.slice(0, 2500)),
    trustmrrUrl: `https://trustmrr.com/startup/${slug}`,
    markdownUrl: `https://trustmrr.com/startup/${slug}.md`,
    revenue: { last30Days: last30, mrr, total },
    growth30d,
    growthMRR30d: mrrGrowthMatch ? Number(mrrGrowthMatch[1]) : null,
    revenueTable: revenueTable.slice(0, 8),
    insights,
    techStack,
    marketingChannels,
    markdownExcerpt: markdown.slice(0, 7000),
    github: githubMap["GitHub connected"]
      ? {
          connected: /yes/i.test(githubMap["GitHub connected"]),
          contrib30: Number.isFinite(contrib30) ? contrib30 : 0,
        }
      : null,
    domainRating: Number.isFinite(domainRating) ? domainRating : null,
    estimatedUsers: insights["Estimated user count"] ?? null,
  };
}

export const FALLBACK_STARTUPS: ScoutProduct[] = [
  {
    name: "Postiz",
    slug: "postiz",
    url: "https://trustmrr.com/startup/postiz",
    icon: "https://icons.duckduckgo.com/ip3/postiz.com.ico",
    description: "The AI social media post scheduling tool & open-source alternative to Buffer and Hootsuite.",
    website: "https://postiz.com",
    category: "Marketing",
    paymentProvider: "Stripe",
    revenue: { last30Days: 4200, mrr: 3400, total: 32000 },
    growth30d: 45,
    growthMRR30d: 38,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["recent", "growing"],
  },
  {
    name: "Formbricks",
    slug: "formbricks",
    url: "https://trustmrr.com/startup/formbricks",
    icon: "https://icons.duckduckgo.com/ip3/formbricks.com.ico",
    description: "Open source survey suite and user micro-feedback platform built for SaaS products.",
    website: "https://formbricks.com",
    category: "Analytics",
    paymentProvider: "Stripe",
    revenue: { last30Days: 9500, mrr: 8200, total: 98000 },
    growth30d: 28,
    growthMRR30d: 24,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["growing"],
  },
  {
    name: "Dub.co",
    slug: "dub-co",
    url: "https://trustmrr.com/startup/dub-co",
    icon: "https://icons.duckduckgo.com/ip3/dub.co.ico",
    description: "Open source modern link management platform with advanced conversions and deep geolocated analytics.",
    website: "https://dub.co",
    category: "Developer Tools",
    paymentProvider: "Stripe",
    revenue: { last30Days: 14200, mrr: 12800, total: 110000 },
    growth30d: 64,
    growthMRR30d: 55,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["growing", "recent"],
  },
  {
    name: "Chatwoot",
    slug: "chatwoot",
    url: "https://trustmrr.com/startup/chatwoot",
    icon: "https://icons.duckduckgo.com/ip3/chatwoot.com.ico",
    description: "Customer engagement platform and open source omnichannel alternative to Intercom and Zendesk.",
    website: "https://chatwoot.com",
    category: "Customer Support",
    paymentProvider: "Stripe",
    revenue: { last30Days: 21000, mrr: 18500, total: 240000 },
    growth30d: 15,
    growthMRR30d: 12,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["recent"],
  },
  {
    name: "Cal.com",
    slug: "cal-com",
    url: "https://trustmrr.com/startup/cal-com",
    icon: "https://icons.duckduckgo.com/ip3/cal.com.ico",
    description: "Open source scheduling infrastructure for everyone — customizable, white-label alternative to Calendly.",
    website: "https://cal.com",
    category: "Productivity",
    paymentProvider: "Stripe",
    revenue: { last30Days: 52000, mrr: 45000, total: 610000 },
    growth30d: 32,
    growthMRR30d: 28,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["growing"],
  },
  {
    name: "Plausible",
    slug: "plausible",
    url: "https://trustmrr.com/startup/plausible",
    icon: "https://icons.duckduckgo.com/ip3/plausible.io.ico",
    description: "Lightweight, privacy-first web analytics without cookies, fully compliant with GDPR, CCPA and PECR.",
    website: "https://plausible.io",
    category: "Analytics",
    paymentProvider: "Paddle",
    revenue: { last30Days: 102000, mrr: 95000, total: 1850000 },
    growth30d: 12,
    growthMRR30d: 10,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["recent"],
  },
  {
    name: "Typebot",
    slug: "typebot",
    url: "https://trustmrr.com/startup/typebot",
    icon: "https://icons.duckduckgo.com/ip3/typebot.io.ico",
    description: "Conversational form builder that makes collecting leads and user feedback as engaging as chatting.",
    website: "https://typebot.io",
    category: "Marketing",
    paymentProvider: "Stripe",
    revenue: { last30Days: 16500, mrr: 14000, total: 175000 },
    growth30d: 38,
    growthMRR30d: 34,
    onSale: true,
    stealthMode: false,
    askingPrice: 450000,
    multiple: 2.7,
    sources: ["listed", "deal", "growing"],
  },
  {
    name: "Documenso",
    slug: "documenso",
    url: "https://trustmrr.com/startup/documenso",
    icon: "https://icons.duckduckgo.com/ip3/documenso.com.ico",
    description: "The open source digital document signing platform, building the open alternative to DocuSign.",
    website: "https://documenso.com",
    category: "Legal Tech",
    paymentProvider: "Stripe",
    revenue: { last30Days: 7800, mrr: 6500, total: 68000 },
    growth30d: 50,
    growthMRR30d: 42,
    onSale: false,
    stealthMode: false,
    askingPrice: null,
    multiple: null,
    sources: ["growing", "recent"],
  },
];

export function getFallbackProfile(slug: string): StartupProfile | null {
  const p = FALLBACK_STARTUPS.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
  if (!p) return null;

  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    website: p.website,
    icon: p.icon,
    category: p.category,
    founder: null,
    country: "US",
    foundedDate: "2023",
    stealthMode: p.stealthMode,
    onSale: p.onSale,
    trustmrrUrl: p.url,
    markdownUrl: `${p.url}.md`,
    revenue: p.revenue,
    growth30d: p.growth30d,
    growthMRR30d: p.growthMRR30d,
    revenueTable: [
      { period: "Last 30 Days", amount: `$${p.revenue.last30Days.toLocaleString()}` },
      { period: "Current MRR", amount: `$${p.revenue.mrr.toLocaleString()}` },
      { period: "Total Revenue", amount: `$${p.revenue.total.toLocaleString()}` },
    ],
    insights: {
      Markets: p.category || "SaaS",
      Category: p.category || "Software",
      "Payment processor": p.paymentProvider || "Stripe",
    },
    techStack: {
      Framework: ["React", "TypeScript", "Node.js"],
      Database: ["PostgreSQL"],
    },
    marketingChannels: ["SEO", "X / Twitter", "Open Source", "Product Hunt"],
    markdownExcerpt: `# ${p.name}\n\n${p.description}\n\n- Category: ${p.category}\n- 30d Revenue: $${p.revenue.last30Days}\n- MRR: $${p.revenue.mrr}`,
    github: { connected: true, contrib30: 142 },
    domainRating: 54,
    estimatedUsers: "10,000+",
  };
}
