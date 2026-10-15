import type { ReviewSnippet } from "./types";

const UA = "Riposte/1.0 (https://grok.com; product research desk)";

const NEGATIVE =
  /\b(scam|refund|cancel+ed|overpriced?|broken|worst|hate|bug|slow|expensive|lock-?in|misleading|terrible|useless|billing|hidden fee|doesn't work|does not work|don't work|support|unreliable|buggy|outage|chargeback|complaint|frustrating|confusing|onboarding|waitlist|paywall|demo|enterprise)\b/i;

function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;|'/gi, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mentions(text: string, name: string): boolean {
  if (!name || name.length < 3) return false;
  return new RegExp(`\\b${escapeRe(name)}\\b`, "i").test(text);
}

async function fetchText(url: string, timeoutMs = 6_000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > 400_000 ? buf.slice(0, 400_000) : buf;
    return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  } catch {
    return null;
  }
}

function hostOf(website: string | null): string {
  if (!website) return "";
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export async function fetchWebsiteText(website: string | null): Promise<string | null> {
  if (!website) return null;
  let url = website;
  try {
    const parsed = new URL(website);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    url = parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }

  const paths = ["", "/pricing", "/price", "/faq", "/reviews"];
  const pages = await Promise.all(paths.map((p) => fetchText(url + p, 5_500)));
  const chunks: string[] = [];
  for (const html of pages) {
    if (!html) continue;
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const jsonLd = extractJsonLdReviews(html);
    const text = stripHtml(html).slice(0, 4_500);
    if (title) chunks.push(`Title: ${stripHtml(title)}`);
    if (jsonLd) chunks.push(jsonLd);
    if (text) chunks.push(text);
  }
  if (!chunks.length) return null;
  return chunks.join("\n").slice(0, 8_000);
}

function extractJsonLdReviews(html: string): string | null {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const lines: string[] = [];
  for (const m of blocks) {
    try {
      const data = JSON.parse(m[1]!) as unknown;
      walkLd(data, lines);
    } catch {
      /* ignore */
    }
  }
  return lines.length ? `Structured reviews:\n${lines.slice(0, 8).join("\n")}` : null;
}

function walkLd(node: unknown, lines: string[], depth = 0): void {
  if (!node || depth > 6 || lines.length >= 8) return;
  if (Array.isArray(node)) {
    for (const item of node) walkLd(item, lines, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  const rec = node as Record<string, unknown>;
  const type = String(rec["@type"] ?? rec.type ?? "");
  if (/review/i.test(type)) {
    const rating = rec.reviewRating as Record<string, unknown> | undefined;
    const value = rating?.ratingValue ?? rec.ratingValue;
    const body = String(rec.reviewBody ?? rec.description ?? "").slice(0, 280);
    if (body) lines.push(`- rating ${value ?? "?"}: ${body}`);
  }
  for (const v of Object.values(rec)) walkLd(v, lines, depth + 1);
}

async function fetchPullpush(name: string): Promise<ReviewSnippet[]> {
  if (name.replace(/[^a-z0-9]/gi, "").length < 5) return [];
  const q = encodeURIComponent(`"${name}" (scam OR refund OR broken OR overpriced OR complaint OR worst OR billing)`);
  const [subs, comments] = await Promise.all([
    fetchText(`https://api.pullpush.io/reddit/search/submission/?q=${q}&size=20`, 6_000),
    fetchText(`https://api.pullpush.io/reddit/search/comment/?q=${q}&size=20`, 6_000),
  ]);
  const out: ReviewSnippet[] = [];
  const ingest = (raw: string | null, kind: "post" | "comment") => {
    if (!raw) return;
    try {
      const json = JSON.parse(raw) as { data?: Array<Record<string, unknown>> };
      for (const d of json.data ?? []) {
        const title = stripHtml(String(d.title ?? d.link_title ?? ""));
        const body = stripHtml(String(d.selftext ?? d.body ?? ""));
        const hay = `${title} ${body}`;
        if (!mentions(hay, name)) continue;
        if (!NEGATIVE.test(hay) && kind === "comment" && body.length < 80) continue;
        const permalink = String(d.permalink ?? "");
        const sub = String(d.subreddit ?? "reddit");
        out.push({
          source: `r/${sub}`,
          title: title || "Reddit comment",
          url: permalink ? `https://www.reddit.com${permalink}` : "https://www.reddit.com",
          body: (body || title).slice(0, 420),
        });
      }
    } catch {
      /* ignore */
    }
  };
  ingest(subs, "post");
  ingest(comments, "comment");
  return unique(out).slice(0, 8);
}

async function fetchHn(name: string, host: string): Promise<ReviewSnippet[]> {
  const queries = [`"${name}"`, host ? host : ""].filter(Boolean);
  const out: ReviewSnippet[] = [];
  await Promise.all(
    queries.map(async (q) => {
      const raw = await fetchText(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&hitsPerPage=12`,
        5_500,
      );
      if (!raw) return;
      try {
        const json = JSON.parse(raw) as {
          hits?: Array<{
            title?: string | null;
            story_title?: string | null;
            comment_text?: string | null;
            url?: string | null;
            story_url?: string | null;
            objectID?: string;
            points?: number;
          }>;
        };
        for (const hit of json.hits ?? []) {
          const title = stripHtml(hit.title || hit.story_title || "HN");
          const body = stripHtml(hit.comment_text || title);
          const hay = `${title} ${body}`;
          const relevant = mentions(hay, name) || (host && hay.toLowerCase().includes(host.toLowerCase()));
          if (!relevant) continue;
          if (!NEGATIVE.test(hay) && !mentions(hay, name)) continue;
          out.push({
            source: "Hacker News",
            title,
            url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            body: body.slice(0, 420),
          });
        }
      } catch {
        /* ignore */
      }
    }),
  );
  return unique(out).slice(0, 6);
}

function unique(items: ReviewSnippet[]): ReviewSnippet[] {
  const seen = new Set<string>();
  const out: ReviewSnippet[] = [];
  for (const item of items) {
    const key = `${item.url}|${item.body.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function reviewsFromWebsite(
  websiteText: string | null,
  name: string,
  website: string | null,
): ReviewSnippet[] {
  if (!websiteText) return [];
  const url = website || "#";
  const out: ReviewSnippet[] = [];

  const structured = websiteText.match(/Structured reviews:\n([\s\S]*?)(?:\n[A-Z]|$)/);
  if (structured?.[1]) {
    for (const line of structured[1].split("\n")) {
      const body = line.replace(/^-+\s*/, "").trim();
      if (body.length < 24) continue;
      out.push({
        source: "Product site",
        title: "Published review",
        url,
        body: body.slice(0, 420),
      });
    }
  }

  const SITE_PAIN =
    /\b(refund|overpriced?|hidden fee|doesn't work|does not work|no refund|non-refundable|waitlist|contact (us )?for pricing|book a demo|talk to sales)\b/i;

  const sentences = websiteText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 280 && SITE_PAIN.test(s));

  for (const sentence of sentences.slice(0, 4)) {
    out.push({
      source: "Product site",
      title: `${name} copy`,
      url,
      body: sentence,
    });
  }

  return unique(out).slice(0, 6);
}

export async function gatherReviews(name: string, website: string | null): Promise<ReviewSnippet[]> {
  const host = hostOf(website);
  const [reddit, hn] = await Promise.all([fetchPullpush(name), fetchHn(name, host)]);
  return unique([...reddit, ...hn]).slice(0, 10);
}
