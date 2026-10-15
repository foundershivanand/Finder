import { formatCount, formatRating } from "./format";
import { BROWSER_UA, fetchJson, fetchText, readCache, stripHtml, writeCache } from "./http.server";
import { emptyTarget } from "./profile";
import type { DeskKind, ReviewSnippet, ScoutHit, TargetProfile } from "./types";

export const IDEA_KINDS: DeskKind[] = [
  "producthunt",
  "twitter",
  "hackernews",
  "github",
  "betalist",
  "lobsters",
  "devto",
  "firefox",
  "launchingnext",
];

export function isIdeaKind(kind: DeskKind): boolean {
  return IDEA_KINDS.includes(kind);
}

type CachedHit = { hit: ScoutHit; profile: TargetProfile; reviews: ReviewSnippet[] };
const records = new Map<string, CachedHit>();

function keyOf(kind: DeskKind, id: string) {
  return `${kind}:${id}`;
}

function remember(row: CachedHit) {
  records.set(keyOf(row.hit.kind, row.hit.id), row);
}

export function peekIdea(kind: DeskKind, id: string): CachedHit | null {
  return records.get(keyOf(kind, id)) ?? null;
}

type RssEntry = {
  id: string;
  title: string;
  link: string;
  body: string;
  author: string;
  date: string;
};

function tagInner(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? stripHtml(m[1]) : "";
}

function attrHref(block: string): string {
  const m = block.match(/<link[^>]+href=["']([^"']+)["']/i) || block.match(/<link>([^<]+)<\/link>/i);
  return (m?.[1] ?? "").trim();
}

function parseFeedEntries(xml: string): RssEntry[] {
  const cleaned = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const chunks = [...cleaned.matchAll(/<(?:entry|item)[\s\S]*?<\/(?:entry|item)>/gi)].map((m) => m[0]);
  const out: RssEntry[] = [];
  for (const block of chunks) {
    const title = tagInner(block, "title");
    const link = attrHref(block).replace(/#m$/, "");
    const guid = tagInner(block, "guid") || tagInner(block, "id") || link;
    const body = stripHtml(tagInner(block, "content") || tagInner(block, "description") || tagInner(block, "summary"));
    const author = tagInner(block, "name") || tagInner(block, "dc:creator") || tagInner(block, "author");
    const date = tagInner(block, "updated") || tagInner(block, "published") || tagInner(block, "pubDate");
    if (!title || title.length < 3) continue;
    out.push({ id: guid, title, link, body, author, date });
  }
  return out;
}

function loc(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    const v = rec["en-US"] ?? rec.en ?? Object.values(rec)[0];
    return typeof v === "string" ? v : "";
  }
  return "";
}

function tweetIdFrom(entry: RssEntry): string | null {
  const fromGuid = entry.id.match(/(\d{15,22})/);
  if (fromGuid) return fromGuid[1];
  const fromLink = entry.link.match(/status\/(\d{15,22})/);
  return fromLink?.[1] ?? null;
}

const NSFW =
  /\b(onlyfans|porn|nsfw|nude|xxx|loli|underage|identity preservation|genjutsu|reference image of the girl)\b/i;
const DEMAND =
  /\b(i wish|looking for|need an? (app|tool|site)|is there an? (app|tool)|someone (please )?make|somebody make|app idea|build me|why isn'?t there|alternative to|micro-?saas|i would pay)\b/i;

function hitCard(
  kind: DeskKind,
  id: string,
  name: string,
  description: string,
  sourceUrl: string,
  opts: {
    icon?: string | null;
    category?: string | null;
    stats: ScoutHit["stats"];
    badges?: string[];
    pain?: string | null;
  },
): ScoutHit {
  return {
    kind,
    id,
    name,
    description,
    icon: opts.icon ?? null,
    category: opts.category ?? null,
    sourceUrl,
    stats: opts.stats,
    badges: opts.badges ?? [],
    tags: opts.badges ?? [],
    painPreview: opts.pain ?? description.slice(0, 180),
  };
}

async function loadProductHunt(): Promise<ScoutHit[]> {
  const xml = await fetchText("https://www.producthunt.com/feed", { timeoutMs: 10_000, ua: BROWSER_UA });
  if (!xml) throw new Error("Product Hunt feed was quiet.");
  const hits: ScoutHit[] = [];
  for (const e of parseFeedEntries(xml)) {
    const slug = e.link.match(/producthunt\.com\/products\/([a-z0-9-]+)/i)?.[1];
    if (!slug) continue;
    const url = `https://www.producthunt.com/products/${slug}`;
    const desc = e.body.replace(/Discussion\s*\|\s*Link/i, "").trim();
    const hit = hitCard("producthunt", slug, e.title.trim(), desc || "A Product Hunt launch.", url, {
      category: "Product Hunt",
      stats: [
        { label: "Maker", value: e.author || "—" },
        { label: "Listed", value: e.date.slice(0, 10) || "—" },
      ],
      badges: ["Launch"],
      pain: desc.slice(0, 180) || null,
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "producthunt",
        id: slug,
        name: e.title.trim(),
        description: desc,
        category: "Product Hunt",
        website: url,
        sourceUrl: url,
        sourceLabel: "Product Hunt",
        developer: e.author || null,
        extra: { published: e.date },
      }),
      reviews: desc
        ? [{ source: "Product Hunt", title: e.title, url, body: desc.slice(0, 500) }]
        : [],
    });
    hits.push(hit);
    if (hits.length >= 36) break;
  }
  return hits;
}

async function nitterRss(path: string): Promise<RssEntry[]> {
  const xml = await fetchText(`https://nitter.meowing.monster${path}`, { timeoutMs: 10_000, ua: BROWSER_UA });
  return xml ? parseFeedEntries(xml) : [];
}

async function loadTwitter(): Promise<ScoutHit[]> {
  const [wish, someone, looking, levelsio, ph] = await Promise.all([
    nitterRss("/search/rss?f=tweets&q=I%20wish%20there%20was%20an%20app"),
    nitterRss("/search/rss?f=tweets&q=someone%20should%20make"),
    nitterRss("/search/rss?f=tweets&q=looking%20for%20a%20tool%20that"),
    nitterRss("/levelsio/rss"),
    nitterRss("/ProductHunt/rss"),
  ]);
  const builders = new Set(["levelsio", "producthunt", "indiehackers", "ycombinator", "levelsio"]);
  const merged = [...wish, ...someone, ...looking, ...levelsio, ...ph];
  const seen = new Set<string>();
  const hits: ScoutHit[] = [];
  for (const e of merged) {
    const id = tweetIdFrom(e);
    if (!id || seen.has(id)) continue;
    const handle = (e.author.replace(/^@/, "") || e.link.match(/nitter\.[^/]+\/([^/]+)\//)?.[1] || "user").replace(
      /^@/,
      "",
    );
    const text = `${e.title} ${e.body}`.replace(/\s+/g, " ").trim();
    if (text.length < 40 || NSFW.test(text)) continue;
    const fromBuilder = builders.has(handle.toLowerCase());
    if (!fromBuilder && !DEMAND.test(text)) continue;
    seen.add(id);
    const url = `https://x.com/${handle}/status/${id}`;
    const name = e.title.replace(/\s+/g, " ").trim().slice(0, 110) || text.slice(0, 90);
    const hit = hitCard("twitter", id, name, text.slice(0, 280), url, {
      category: `@${handle}`,
      stats: [
        { label: "From", value: `@${handle}` },
        { label: "Posted", value: e.date.slice(0, 16) || "—" },
      ],
      badges: fromBuilder ? ["Builder"] : ["Ask"],
      pain: text.slice(0, 180),
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "twitter",
        id,
        name,
        description: text.slice(0, 900),
        category: "X / Twitter",
        website: url,
        sourceUrl: url,
        sourceLabel: "Twitter",
        developer: `@${handle}`,
        extra: { handle },
      }),
      reviews: [{ source: `X · @${handle}`, title: name, url, body: text.slice(0, 700) }],
    });
    hits.push(hit);
    if (hits.length >= 40) break;
  }
  if (!hits.length) throw new Error("Twitter search did not return usable asks.");
  return hits;
}

type HnHit = {
  objectID: string;
  title: string;
  url?: string | null;
  author?: string;
  points?: number;
  num_comments?: number;
  story_text?: string | null;
  created_at?: string;
};

async function loadHackerNews(): Promise<ScoutHit[]> {
  const [show, ask] = await Promise.all([
    fetchJson("https://hn.algolia.com/api/v1/search?tags=show_hn&hitsPerPage=25", { timeoutMs: 10_000 }),
    fetchJson("https://hn.algolia.com/api/v1/search?tags=ask_hn&hitsPerPage=15", { timeoutMs: 10_000 }),
  ]);
  const rows: HnHit[] = [
    ...(((show as { hits?: HnHit[] } | null)?.hits ?? []) as HnHit[]),
    ...(((ask as { hits?: HnHit[] } | null)?.hits ?? []) as HnHit[]),
  ];
  rows.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  const hits: ScoutHit[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    const id = String(r.objectID ?? "");
    const title = (r.title ?? "").trim();
    if (!id || !/^\d+$/.test(id) || !title || seen.has(id)) continue;
    if (/who is hiring|who wants to be hired|friday|weekend/i.test(title)) continue;
    seen.add(id);
    const url = `https://news.ycombinator.com/item?id=${id}`;
    const askPost = /^ask hn/i.test(title);
    const desc = (r.story_text || title).replace(/\s+/g, " ").trim();
    const hit = hitCard("hackernews", id, title.replace(/^Show HN:\s*/i, "").replace(/^Ask HN:\s*/i, ""), desc, url, {
      category: askPost ? "Ask HN" : "Show HN",
      stats: [
        { label: "Points", value: formatCount(r.points) },
        { label: "Comments", value: formatCount(r.num_comments) },
      ],
      badges: [askPost ? "Ask" : "Show"],
      pain: desc.slice(0, 180),
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "hackernews",
        id,
        name: hit.name,
        description: desc,
        category: askPost ? "Ask HN" : "Show HN",
        website: r.url || url,
        sourceUrl: url,
        sourceLabel: "Hacker News",
        developer: r.author ?? null,
        score: r.points ?? 0,
        comments: r.num_comments ?? 0,
        extra: { created: r.created_at ?? "" },
      }),
      reviews: [],
    });
    hits.push(hit);
    if (hits.length >= 36) break;
  }
  if (!hits.length) throw new Error("Hacker News did not return stories.");
  return hits;
}

type GhRepo = {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner?: { login?: string; avatar_url?: string };
  homepage?: string | null;
  open_issues_count?: number;
  pushed_at?: string;
};

async function loadGitHub(): Promise<ScoutHit[]> {
  const json = await fetchJson(
    "https://api.github.com/search/repositories?q=stars:400..80000+pushed:%3E2026-08-01+NOT+awesome+NOT+list&sort=stars&order=desc&per_page=30",
    { timeoutMs: 10_000, ua: "Riposte-Scout" },
  );
  const items = ((json as { items?: GhRepo[] } | null)?.items ?? []).filter((r) => {
    const n = `${r.full_name} ${r.description ?? ""}`.toLowerCase();
    return !/awesome-|awesome /i.test(n) && (r.description ?? "").length > 20;
  });
  const hits: ScoutHit[] = [];
  for (const r of items) {
    const [owner, repo] = r.full_name.split("/");
    if (!owner || !repo) continue;
    const id = `${owner}~${repo}`;
    const url = r.html_url;
    const desc = (r.description ?? "").trim();
    const hit = hitCard("github", id, r.name, desc, url, {
      icon: r.owner?.avatar_url ?? null,
      category: r.language || "GitHub",
      stats: [
        { label: "Stars", value: formatCount(r.stargazers_count) },
        { label: "Issues", value: formatCount(r.open_issues_count) },
      ],
      badges: r.language ? [r.language] : ["Repo"],
      pain: desc.slice(0, 180),
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "github",
        id,
        name: r.full_name,
        description: desc,
        icon: r.owner?.avatar_url ?? null,
        category: r.language,
        website: r.homepage || url,
        sourceUrl: url,
        sourceLabel: "GitHub",
        developer: owner,
        score: r.stargazers_count,
        comments: r.open_issues_count ?? 0,
        extra: { language: r.language ?? "", pushed: r.pushed_at ?? "" },
      }),
      reviews: [],
    });
    hits.push(hit);
  }
  if (!hits.length) throw new Error("GitHub search was empty.");
  return hits;
}

async function loadBetaList(): Promise<ScoutHit[]> {
  const xml = await fetchText("https://feeds.feedburner.com/BetaList", { timeoutMs: 10_000, ua: BROWSER_UA });
  if (!xml) throw new Error("BetaList feed was quiet.");
  const hits: ScoutHit[] = [];
  for (const e of parseFeedEntries(xml)) {
    const slug = e.link.match(/betalist\.com\/startups\/([a-z0-9-]+)/i)?.[1];
    if (!slug) continue;
    const url = `https://betalist.com/startups/${slug}`;
    const desc = e.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const name = e.title.replace(/\s+[–—].*/, "").trim() || e.title;
    const tagline = e.title.includes("–") || e.title.includes("—") ? e.title.replace(/^.*?[–—]\s*/, "") : desc;
    const hit = hitCard("betalist", slug, name, tagline || desc, url, {
      category: "BetaList",
      stats: [
        { label: "Listed", value: e.date.slice(0, 10) || "—" },
        { label: "Desk", value: "Beta" },
      ],
      badges: ["Startup"],
      pain: (tagline || desc).slice(0, 180),
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "betalist",
        id: slug,
        name,
        description: tagline || desc,
        category: "BetaList",
        website: url,
        sourceUrl: url,
        sourceLabel: "BetaList",
        extra: { published: e.date },
      }),
      reviews: [{ source: "BetaList", title: name, url, body: (tagline || desc).slice(0, 500) }],
    });
    hits.push(hit);
    if (hits.length >= 30) break;
  }
  if (!hits.length) throw new Error("BetaList had no launches.");
  return hits;
}

type LobStory = {
  short_id: string;
  title: string;
  url: string;
  score: number;
  comment_count: number;
  description?: string;
  tags?: string[];
  submitter_user?: string;
  comments_url?: string;
};

async function loadLobsters(): Promise<ScoutHit[]> {
  const json = await fetchJson("https://lobste.rs/hottest.json", { timeoutMs: 10_000, ua: BROWSER_UA });
  const rows = Array.isArray(json) ? (json as LobStory[]) : [];
  const hits: ScoutHit[] = [];
  for (const r of rows) {
    const id = r.short_id;
    const title = (r.title ?? "").trim();
    if (!id || !title || /what are you doing this (weekend|week)/i.test(title)) continue;
    const url = `https://lobste.rs/s/${id}`;
    const desc = (r.description || title).replace(/\s+/g, " ").trim();
    const hit = hitCard("lobsters", id, title, desc, url, {
      category: (r.tags ?? []).slice(0, 2).join(" · ") || "Lobsters",
      stats: [
        { label: "Score", value: formatCount(r.score) },
        { label: "Comments", value: formatCount(r.comment_count) },
      ],
      badges: (r.tags ?? []).slice(0, 2),
      pain: desc.slice(0, 180),
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "lobsters",
        id,
        name: title,
        description: desc,
        category: (r.tags ?? [])[0] ?? "Lobsters",
        website: r.url || url,
        sourceUrl: url,
        sourceLabel: "Lobsters",
        developer: r.submitter_user ?? null,
        score: r.score,
        comments: r.comment_count,
      }),
      reviews: [],
    });
    hits.push(hit);
    if (hits.length >= 30) break;
  }
  if (!hits.length) throw new Error("Lobsters was empty.");
  return hits;
}

type DevtoArt = {
  id: number;
  title: string;
  description: string;
  url: string;
  tag_list?: string[] | string;
  positive_reactions_count?: number;
  comments_count?: number;
  user?: { username?: string; profile_image_90?: string };
  cover_image?: string | null;
};

async function loadDevto(): Promise<ScoutHit[]> {
  const [a, b] = await Promise.all([
    fetchJson("https://dev.to/api/articles?tag=showdev&per_page=20", { timeoutMs: 10_000 }),
    fetchJson("https://dev.to/api/articles?tag=sideprojects&per_page=15", { timeoutMs: 10_000 }),
  ]);
  const rows = [...(Array.isArray(a) ? (a as DevtoArt[]) : []), ...(Array.isArray(b) ? (b as DevtoArt[]) : [])];
  const seen = new Set<number>();
  const hits: ScoutHit[] = [];
  for (const r of rows) {
    if (!r.id || seen.has(r.id) || !r.title) continue;
    seen.add(r.id);
    const tags = Array.isArray(r.tag_list) ? r.tag_list : String(r.tag_list ?? "").split(",").map((t) => t.trim());
    const id = String(r.id);
    const hit = hitCard("devto", id, r.title, r.description || "A DEV show-and-tell.", r.url, {
      icon: r.user?.profile_image_90 ?? r.cover_image ?? null,
      category: tags[0] || "DEV",
      stats: [
        { label: "Reactions", value: formatCount(r.positive_reactions_count) },
        { label: "Comments", value: formatCount(r.comments_count) },
      ],
      badges: tags.filter(Boolean).slice(0, 2),
      pain: (r.description || "").slice(0, 180) || null,
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "devto",
        id,
        name: r.title,
        description: r.description || r.title,
        icon: r.user?.profile_image_90 ?? null,
        category: tags[0] ?? "DEV",
        website: r.url,
        sourceUrl: r.url,
        sourceLabel: "DEV",
        developer: r.user?.username ?? null,
        score: r.positive_reactions_count ?? 0,
        comments: r.comments_count ?? 0,
      }),
      reviews: [{ source: "DEV", title: r.title, url: r.url, body: (r.description || r.title).slice(0, 500) }],
    });
    hits.push(hit);
    if (hits.length >= 32) break;
  }
  if (!hits.length) throw new Error("DEV.to had no showdev posts.");
  return hits;
}

type AmoAddon = {
  slug: string;
  name: unknown;
  summary: unknown;
  url: string;
  icon_url?: string;
  average_daily_users?: number;
  ratings?: { average?: number; count?: number };
  authors?: Array<{ name?: string }>;
  categories?: string[];
  homepage?: { url?: string } | string;
  requires_payment?: boolean;
};

async function loadFirefox(): Promise<ScoutHit[]> {
  const json = await fetchJson(
    "https://addons.mozilla.org/api/v5/addons/search/?page_size=20&sort=users&type=extension&lang=en-US",
    { timeoutMs: 10_000, ua: BROWSER_UA, maxBytes: 1_500_000 },
  );
  const rows = ((json as { results?: AmoAddon[] } | null)?.results ?? []).filter((a) => a.slug && loc(a.name));
  const hits: ScoutHit[] = [];
  for (const a of rows) {
    const users = a.average_daily_users ?? 0;
    const rating = a.ratings?.average ?? 0;
    if (users < 3_000) continue;
    const name = loc(a.name);
    const summary = loc(a.summary);
    const url = a.url || `https://addons.mozilla.org/firefox/addon/${a.slug}/`;
    const openFlank = rating > 0 && rating < 4.55;
    const hit = hitCard("firefox", a.slug, name, summary || "A popular Firefox add-on.", url, {
      icon: a.icon_url ?? null,
      category: a.categories?.[0] ?? "Add-on",
      stats: [
        { label: "Users", value: formatCount(users) },
        { label: "Rating", value: formatRating(rating) },
      ],
      badges: [openFlank ? "Open flank" : "Popular", ...(a.requires_payment ? ["Paid"] : [])],
      pain: summary.slice(0, 180) || null,
    });
    const homepage = typeof a.homepage === "string" ? a.homepage : a.homepage?.url;
    remember({
      hit,
      profile: emptyTarget({
        kind: "firefox",
        id: a.slug,
        name,
        description: summary,
        icon: a.icon_url ?? null,
        category: a.categories?.[0] ?? "Firefox add-on",
        website: homepage || url,
        sourceUrl: url,
        sourceLabel: "Firefox Add-ons",
        developer: a.authors?.[0]?.name ?? null,
        rating,
        ratingsCount: a.ratings?.count ?? null,
        installs: formatCount(users),
      }),
      reviews: summary ? [{ source: "Firefox Add-ons", title: name, url, body: summary.slice(0, 500) }] : [],
    });
    hits.push(hit);
    if (hits.length >= 30) break;
  }
  if (!hits.length) throw new Error("Firefox add-ons search was empty.");
  return hits.sort((a, b) => {
    const af = a.badges.includes("Open flank") ? 1 : 0;
    const bf = b.badges.includes("Open flank") ? 1 : 0;
    return bf - af;
  });
}

async function loadLaunchingNext(): Promise<ScoutHit[]> {
  const html = await fetchText("https://www.launchingnext.com/", { timeoutMs: 10_000, ua: BROWSER_UA, maxBytes: 250_000 });
  if (!html) throw new Error("Launching Next was quiet.");
  const cards = [...html.matchAll(/<h3>([^<]+)<\/h3>\s*<p class="card-text">([\s\S]*?)<\/p>\s*<a class="stretched-link" href="(\/s\/[^"]+)"/gi)];
  const hits: ScoutHit[] = [];
  for (const m of cards) {
    const name = stripHtml(m[1] ?? "").trim();
    const desc = stripHtml(m[2] ?? "").trim();
    const path = m[3] ?? "";
    const parts = path.match(/\/s\/([a-z0-9-]+)\/(\d+)/i);
    if (!name || !parts) continue;
    const id = `${parts[1]}~${parts[2]}`;
    const url = `https://www.launchingnext.com${path}`;
    const hit = hitCard("launchingnext", id, name, desc || "A new launch.", url, {
      category: "Launching Next",
      stats: [
        { label: "Desk", value: "New" },
        { label: "Source", value: "LN" },
      ],
      badges: ["Launch"],
      pain: desc.slice(0, 180) || null,
    });
    remember({
      hit,
      profile: emptyTarget({
        kind: "launchingnext",
        id,
        name,
        description: desc,
        category: "Launching Next",
        website: url,
        sourceUrl: url,
        sourceLabel: "Launching Next",
      }),
      reviews: desc ? [{ source: "Launching Next", title: name, url, body: desc.slice(0, 500) }] : [],
    });
    hits.push(hit);
    if (hits.length >= 28) break;
  }
  if (!hits.length) throw new Error("Launching Next had no cards.");
  return hits;
}

const loaders: Record<string, () => Promise<ScoutHit[]>> = {
  producthunt: loadProductHunt,
  twitter: loadTwitter,
  hackernews: loadHackerNews,
  github: loadGitHub,
  betalist: loadBetaList,
  lobsters: loadLobsters,
  devto: loadDevto,
  firefox: loadFirefox,
  launchingnext: loadLaunchingNext,
};

export async function loadIdeaFeed(kind: DeskKind): Promise<ScoutHit[]> {
  const cached = readCache<ScoutHit[]>(`idea:${kind}`, 20 * 60_000);
  if (cached?.length) return cached;
  const loader = loaders[kind];
  if (!loader) throw new Error("Unknown desk");
  const hits = await loader();
  return writeCache(`idea:${kind}`, hits);
}

async function enrichTwitter(id: string): Promise<CachedHit | null> {
  const json = await fetchJson(`https://api.fxtwitter.com/status/${id}`, { timeoutMs: 8_000, ua: BROWSER_UA });
  const tweet = (json as { tweet?: Record<string, unknown> } | null)?.tweet;
  if (!tweet) return null;
  const text = String(tweet.text ?? "").trim();
  const author = (tweet.author as { screen_name?: string; name?: string } | undefined) ?? {};
  const handle = author.screen_name || "user";
  const url = String(tweet.url ?? `https://x.com/${handle}/status/${id}`);
  const name = text.slice(0, 110) || `Tweet by @${handle}`;
  const hit = hitCard("twitter", id, name, text.slice(0, 280), url, {
    category: `@${handle}`,
    stats: [{ label: "From", value: `@${handle}` }],
    badges: ["Ask"],
    pain: text.slice(0, 180),
  });
  const row: CachedHit = {
    hit,
    profile: emptyTarget({
      kind: "twitter",
      id,
      name,
      description: text.slice(0, 900),
      category: "X / Twitter",
      website: url,
      sourceUrl: url,
      sourceLabel: "Twitter",
      developer: `@${handle}`,
      extra: { handle },
    }),
    reviews: [{ source: `X · @${handle}`, title: name, url, body: text.slice(0, 800) }],
  };
  remember(row);
  return row;
}

async function enrichHackerNews(id: string, base: CachedHit | null): Promise<ReviewSnippet[]> {
  const json = await fetchJson(`https://hn.algolia.com/api/v1/items/${id}`, { timeoutMs: 10_000 });
  if (!json || typeof json !== "object") return base?.reviews ?? [];
  const rec = json as { title?: string; text?: string; children?: Array<{ text?: string; author?: string }> };
  const reviews: ReviewSnippet[] = [];
  if (rec.text) {
    reviews.push({
      source: "Hacker News",
      title: rec.title || "Story",
      url: `https://news.ycombinator.com/item?id=${id}`,
      body: stripHtml(rec.text).slice(0, 700),
    });
  }
  for (const c of rec.children ?? []) {
    const body = stripHtml(c.text ?? "");
    if (body.length < 40) continue;
    reviews.push({
      source: `HN · ${c.author ?? "comment"}`,
      title: "Comment",
      url: `https://news.ycombinator.com/item?id=${id}`,
      body: body.slice(0, 500),
    });
    if (reviews.length >= 8) break;
  }
  return reviews;
}

async function enrichGitHub(id: string, base: CachedHit | null): Promise<ReviewSnippet[]> {
  const [owner, repo] = id.split("~");
  if (!owner || !repo) return base?.reviews ?? [];
  const json = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=8`, {
    timeoutMs: 10_000,
    ua: "Riposte-Scout",
  });
  const issues = Array.isArray(json) ? json : [];
  const reviews: ReviewSnippet[] = [];
  for (const issue of issues) {
    const rec = issue as { title?: string; body?: string; html_url?: string; pull_request?: unknown };
    if (rec.pull_request) continue;
    const body = `${rec.title ?? ""}. ${stripHtml(rec.body ?? "")}`.replace(/\s+/g, " ").trim();
    if (body.length < 30) continue;
    reviews.push({
      source: "GitHub Issues",
      title: rec.title || "Issue",
      url: rec.html_url || `https://github.com/${owner}/${repo}`,
      body: body.slice(0, 500),
    });
  }
  return reviews;
}

async function enrichLobsters(id: string): Promise<ReviewSnippet[]> {
  const json = await fetchJson(`https://lobste.rs/s/${id}.json`, { timeoutMs: 8_000, ua: BROWSER_UA });
  const rec = json as { comments?: Array<{ comment?: string; commenting_user?: { username?: string } }> } | null;
  const reviews: ReviewSnippet[] = [];
  for (const c of rec?.comments ?? []) {
    const body = stripHtml(c.comment ?? "");
    if (body.length < 40) continue;
    reviews.push({
      source: `Lobsters · ${c.commenting_user?.username ?? "user"}`,
      title: "Comment",
      url: `https://lobste.rs/s/${id}`,
      body: body.slice(0, 500),
    });
    if (reviews.length >= 8) break;
  }
  return reviews;
}

async function enrichGitHubRepo(id: string): Promise<CachedHit | null> {
  const [owner, repo] = id.split("~");
  if (!owner || !repo) return null;
  const json = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`, { timeoutMs: 8_000, ua: "Riposte-Scout" });
  if (!json || typeof json !== "object") return null;
  const r = json as GhRepo;
  const desc = (r.description ?? "").trim() || `${r.full_name} on GitHub`;
  const url = r.html_url || `https://github.com/${owner}/${repo}`;
  const hit = hitCard("github", id, r.name || repo, desc, url, {
    icon: r.owner?.avatar_url ?? null,
    category: r.language || "GitHub",
    stats: [{ label: "Stars", value: formatCount(r.stargazers_count) }],
    badges: r.language ? [r.language] : ["Repo"],
  });
  const row: CachedHit = {
    hit,
    profile: emptyTarget({
      kind: "github",
      id,
      name: r.full_name || id.replace("~", "/"),
      description: desc,
      icon: r.owner?.avatar_url ?? null,
      category: r.language,
      website: r.homepage || url,
      sourceUrl: url,
      sourceLabel: "GitHub",
      developer: owner,
      score: r.stargazers_count ?? 0,
    }),
    reviews: [],
  };
  remember(row);
  return row;
}

async function enrichHackerNewsStory(id: string): Promise<CachedHit | null> {
  const json = await fetchJson(`https://hn.algolia.com/api/v1/items/${id}`, { timeoutMs: 8_000 });
  if (!json || typeof json !== "object") return null;
  const rec = json as { title?: string; text?: string; author?: string; points?: number; url?: string; children?: unknown[] };
  const title = (rec.title ?? "").replace(/^Show HN:\s*/i, "").replace(/^Ask HN:\s*/i, "").trim();
  if (!title) return null;
  const url = `https://news.ycombinator.com/item?id=${id}`;
  const desc = stripHtml(rec.text ?? title);
  const hit = hitCard("hackernews", id, title, desc, url, {
    category: /^ask hn/i.test(rec.title ?? "") ? "Ask HN" : "Show HN",
    stats: [{ label: "Points", value: formatCount(rec.points) }],
    badges: ["HN"],
  });
  const row: CachedHit = {
    hit,
    profile: emptyTarget({
      kind: "hackernews",
      id,
      name: title,
      description: desc,
      website: rec.url || url,
      sourceUrl: url,
      sourceLabel: "Hacker News",
      developer: rec.author ?? null,
      score: rec.points ?? 0,
    }),
    reviews: [],
  };
  remember(row);
  return row;
}

async function enrichFirefox(id: string): Promise<CachedHit | null> {
  const json = await fetchJson(`https://addons.mozilla.org/api/v5/addons/addon/${id}/`, { timeoutMs: 8_000, ua: BROWSER_UA });
  if (!json || typeof json !== "object") return null;
  const a = json as AmoAddon & { slug?: string };
  const name = loc(a.name);
  if (!name) return null;
  const url = a.url || `https://addons.mozilla.org/firefox/addon/${id}/`;
  const summary = loc(a.summary);
  const hit = hitCard("firefox", id, name, summary, url, {
    icon: a.icon_url ?? null,
    category: a.categories?.[0] ?? "Add-on",
    stats: [
      { label: "Users", value: formatCount(a.average_daily_users) },
      { label: "Rating", value: formatRating(a.ratings?.average) },
    ],
  });
  const row: CachedHit = {
    hit,
    profile: emptyTarget({
      kind: "firefox",
      id,
      name,
      description: summary,
      icon: a.icon_url ?? null,
      website: url,
      sourceUrl: url,
      sourceLabel: "Firefox Add-ons",
      rating: a.ratings?.average ?? null,
      ratingsCount: a.ratings?.count ?? null,
      installs: formatCount(a.average_daily_users),
    }),
    reviews: summary ? [{ source: "Firefox Add-ons", title: name, url, body: summary.slice(0, 500) }] : [],
  };
  remember(row);
  return row;
}

export async function loadIdeaProfile(kind: DeskKind, id: string): Promise<{ profile: TargetProfile; reviews: ReviewSnippet[] }> {
  if (!peekIdea(kind, id)) {
    try {
      await loadIdeaFeed(kind);
    } catch {
      /* profile endpoints may still work */
    }
  }
  let row = peekIdea(kind, id);
  if (!row && kind === "twitter") row = await enrichTwitter(id);
  if (!row && kind === "github") row = await enrichGitHubRepo(id);
  if (!row && kind === "hackernews") row = await enrichHackerNewsStory(id);
  if (!row && kind === "firefox") row = await enrichFirefox(id);
  if (!row) throw new Error("That listing could not be loaded. Go back and open it from the desk.");

  let reviews = row.reviews;
  if (kind === "hackernews") reviews = await enrichHackerNews(id, row);
  if (kind === "github") reviews = await enrichGitHub(id, row);
  if (kind === "lobsters") reviews = await enrichLobsters(id);
  if (reviews.length) row = { ...row, reviews };
  remember(row);
  return { profile: row.profile, reviews };
}
