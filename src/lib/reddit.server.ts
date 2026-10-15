import { formatCount } from "./format";
import { BROWSER_UA, fetchJson, fetchText, readCache, stripHtml, writeCache } from "./http.server";
import { emptyTarget } from "./profile";
import type { ReviewSnippet, ScoutHit, TargetProfile } from "./types";

type RedditPost = {
  id: string;
  subreddit: string;
  title: string;
  body: string;
  author: string;
  score: number;
  comments: number;
  createdUtc: number;
  permalink: string;
  flair: string | null;
  tags: string[];
};

const postCache = new Map<string, RedditPost>();
const DEMAND =
  /\b(i wish|looking for|need an? (app|tool|site|plugin)|is there an? (app|tool)|someone (please )?make|somebody make|app idea|build me|why isn'?t there|alternative to|replace .{3,20} with)\b/i;

function remember(post: RedditPost) {
  postCache.set(post.id, post);
}

export function peekRedditPost(id: string): RedditPost | null {
  return postCache.get(id) ?? null;
}

function tagPost(p: RedditPost): string[] {
  const tags = new Set<string>(p.tags);
  const sub = p.subreddit.toLowerCase();
  if (sub === "somebodymakethis") tags.add("request");
  if (sub === "appideas" || sub === "lightsab") tags.add("idea");
  if (sub === "saas" || sub === "microsaas" || sub === "startups") tags.add("saas");
  if (DEMAND.test(`${p.title} ${p.body}`)) tags.add("request");
  return Array.from(tags);
}

function toHit(p: RedditPost): ScoutHit {
  const tags = tagPost(p);
  return {
    kind: "reddit",
    id: p.id,
    name: p.title,
    description: p.body.slice(0, 220) || `A request in r/${p.subreddit}.`,
    icon: null,
    category: `r/${p.subreddit}`,
    sourceUrl: p.permalink,
    stats: [
      { label: "Score", value: formatCount(p.score) },
      { label: "Comments", value: formatCount(p.comments) },
    ],
    badges: tags.filter((t) => t !== "request" || tags.length === 1).slice(0, 2),
    tags,
    painPreview: p.body.slice(0, 180) || null,
  };
}

function fromArctic(raw: Record<string, unknown>): RedditPost | null {
  const id = String(raw.id ?? "").replace(/^t3_/, "");
  const title = stripHtml(String(raw.title ?? "")).trim();
  if (!id || !title || title.length < 12) return null;
  if (/monthly thread|creator showcase|megathread|daily thread/i.test(title)) return null;
  const sub = String(raw.subreddit ?? "reddit").replace(/^r\//, "");
  const body = stripHtml(String(raw.selftext ?? raw.body ?? ""));
  const permalink = String(raw.permalink ?? "");
  return {
    id,
    subreddit: sub,
    title,
    body,
    author: String(raw.author ?? ""),
    score: Number(raw.score ?? 0) || 0,
    comments: Number(raw.num_comments ?? 0) || 0,
    createdUtc: Number(raw.created_utc ?? raw.created ?? 0) || 0,
    permalink: permalink
      ? `https://www.reddit.com${permalink.startsWith("/") ? permalink : `/${permalink}`}`
      : `https://www.reddit.com/comments/${id}`,
    flair: raw.link_flair_text ? String(raw.link_flair_text) : null,
    tags: [],
  };
}

async function arcticSub(subreddit: string, limit = 25): Promise<RedditPost[]> {
  const json = await fetchJson(
    `https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=${encodeURIComponent(subreddit)}&limit=${limit}`,
    { timeoutMs: 9_000 },
  );
  if (!json || typeof json !== "object") return [];
  const data = (json as { data?: unknown }).data;
  if (!Array.isArray(data)) return [];
  const out: RedditPost[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const post = fromArctic(item as Record<string, unknown>);
    if (post) out.push(post);
  }
  return out;
}

function parseRss(xml: string, fallbackSub: string): RedditPost[] {
  const entries = xml.split(/<entry>/i).slice(1);
  const out: RedditPost[] = [];
  for (const chunk of entries) {
    const title = stripHtml((chunk.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, ""));
    if (!title || /monthly thread|creator showcase/i.test(title)) continue;
    const link = chunk.match(/<link[^>]+href="([^"]+)"/i)?.[1] ?? "";
    const idMatch = link.match(/comments\/([a-z0-9]+)/i);
    const id = idMatch?.[1];
    if (!id) continue;
    const content = chunk.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] ?? "";
    const author = stripHtml(chunk.match(/<name>([\s\S]*?)<\/name>/i)?.[1] ?? "");
    const category = chunk.match(/<category[^>]+label="r\/([^"]+)"/i)?.[1] ?? fallbackSub;
    const body = stripHtml(content.replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&")).slice(0, 1_800);
    out.push({
      id,
      subreddit: category,
      title,
      body,
      author,
      score: 0,
      comments: 0,
      createdUtc: Date.parse(chunk.match(/<updated>([^<]+)<\/updated>/i)?.[1] ?? "") / 1000 || 0,
      permalink: link.split("?")[0] || `https://www.reddit.com/comments/${id}`,
      flair: null,
      tags: [],
    });
  }
  return out;
}

async function rssFeed(url: string, sub: string): Promise<RedditPost[]> {
  const xml = await fetchText(url, { timeoutMs: 8_000, ua: BROWSER_UA, maxBytes: 200_000 });
  if (!xml || !xml.includes("<entry")) return [];
  return parseRss(xml, sub);
}

function mergePosts(lists: RedditPost[][]): RedditPost[] {
  const map = new Map<string, RedditPost>();
  for (const list of lists) {
    for (const p of list) {
      const prev = map.get(p.id);
      if (!prev) {
        map.set(p.id, p);
        continue;
      }
      map.set(p.id, {
        ...prev,
        body: p.body.length > prev.body.length ? p.body : prev.body,
        score: Math.max(prev.score, p.score),
        comments: Math.max(prev.comments, p.comments),
        title: prev.title || p.title,
      });
    }
  }
  return Array.from(map.values());
}

function isDemand(p: RedditPost): boolean {
  const sub = p.subreddit.toLowerCase();
  if (sub === "somebodymakethis" || sub === "appideas") return p.title.length > 16;
  return DEMAND.test(`${p.title} ${p.body}`);
}

export async function loadRedditFeed(): Promise<ScoutHit[]> {
  const cached = readCache<ScoutHit[]>("desk:reddit", 8 * 60_000);
  if (cached) return cached;

  const [smt, ideas, saasArctic, smtRss, saasRss] = await Promise.all([
    arcticSub("SomebodyMakeThis", 30).catch(() => [] as RedditPost[]),
    arcticSub("AppIdeas", 20).catch(() => [] as RedditPost[]),
    arcticSub("SaaS", 20).catch(() => [] as RedditPost[]),
    rssFeed("https://www.reddit.com/r/SomebodyMakeThis/.rss", "SomebodyMakeThis"),
    rssFeed(
      "https://www.reddit.com/r/SaaS/search.rss?q=looking+for+OR+%22i+wish%22+OR+%22is+there+an+app%22&sort=new&restrict_sr=1",
      "SaaS",
    ),
  ]);

  const merged = mergePosts([smt, ideas, saasArctic, smtRss, saasRss])
    .filter(isDemand)
    .sort((a, b) => b.comments + b.score * 0.3 - (a.comments + a.score * 0.3) || b.createdUtc - a.createdUtc)
    .slice(0, 36);

  for (const p of merged) remember(p);
  const hits = merged.map(toHit);
  return writeCache("desk:reddit", hits);
}

async function loadComments(id: string): Promise<ReviewSnippet[]> {
  const json = await fetchJson(
    `https://arctic-shift.photon-reddit.com/api/comments/search?link_id=t3_${id}&limit=20`,
    { timeoutMs: 8_000 },
  );
  if (!json || typeof json !== "object") return [];
  const data = (json as { data?: unknown }).data;
  if (!Array.isArray(data)) return [];
  const out: ReviewSnippet[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const body = stripHtml(String(rec.body ?? ""));
    if (body.length < 40 || body === "[deleted]" || body === "[removed]") continue;
    if (/^i am a bot|automod/i.test(body)) continue;
    out.push({
      source: `u/${String(rec.author ?? "reddit")}`,
      title: "Thread comment",
      url: `https://www.reddit.com${String(rec.permalink ?? `/comments/${id}`)}`,
      body: body.slice(0, 420),
    });
    if (out.length >= 8) break;
  }
  return out;
}

export async function loadRedditProfile(id: string): Promise<{ profile: TargetProfile; reviews: ReviewSnippet[] }> {
  const key = `reddit:${id}`;
  const cached = readCache<{ profile: TargetProfile; reviews: ReviewSnippet[] }>(key, 12 * 60_000);
  if (cached) return cached;

  let post = peekRedditPost(id);
  if (!post) {
    const json = await fetchJson(
      `https://arctic-shift.photon-reddit.com/api/posts/search?ids=${id}`,
      { timeoutMs: 8_000 },
    );
    const data = json && typeof json === "object" ? (json as { data?: unknown }).data : null;
    if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
      const parsed = fromArctic(data[0] as Record<string, unknown>);
      if (parsed) post = parsed;
    }
  }
  if (!post) {
    const rss = await rssFeed(`https://www.reddit.com/comments/${id}.rss`, "reddit");
    post = rss[0] ?? null;
  }
  if (!post) throw new Error("That Reddit thread could not be loaded.");

  remember(post);
  const comments = await loadComments(id);
  const reviews: ReviewSnippet[] = [
    {
      source: `r/${post.subreddit}`,
      title: post.title,
      url: post.permalink,
      body: (post.body || post.title).slice(0, 600),
    },
    ...comments,
  ];

  const profile = emptyTarget({
    kind: "reddit",
    id: post.id,
    name: post.title,
    description: post.body.slice(0, 900) || `A request posted in r/${post.subreddit}.`,
    category: `r/${post.subreddit}`,
    website: post.permalink,
    sourceUrl: post.permalink,
    sourceLabel: `r/${post.subreddit}`,
    developer: post.author ? `u/${post.author}` : null,
    extra: { flair: post.flair ?? "", author: post.author },
    score: post.score,
    comments: post.comments,
    subreddit: post.subreddit,
  });

  const value = { profile, reviews };
  return writeCache(key, value);
}
