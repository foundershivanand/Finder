import type { Revenue, ScoutFeed, ScoutProduct, ScoutSource, StartupProfile } from "./types";

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
    fetchJson(DISCOVERY) as Promise<Record<string, unknown>>,
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
