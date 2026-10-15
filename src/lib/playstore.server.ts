import { formatRating } from "./format";
import { BROWSER_UA, decodeEntities, fetchText, readCache, stripHtml, writeCache } from "./http.server";
import { emptyTarget } from "./profile";
import type { ReviewSnippet, ScoutHit, TargetProfile } from "./types";

type PlayApp = {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  rating: number | null;
  ratingsLabel: string | null;
  description: string;
  developer: string | null;
  installs: string | null;
  url: string;
};

const appCache = new Map<string, PlayApp>();
const CATEGORIES: Array<{ path: string; tag: string }> = [
  { path: "PRODUCTIVITY", tag: "Productivity" },
  { path: "PHOTOGRAPHY", tag: "Photo" },
  { path: "FINANCE", tag: "Finance" },
  { path: "HEALTH_AND_FITNESS", tag: "Health" },
];

function remember(app: PlayApp) {
  const prev = appCache.get(app.id);
  appCache.set(app.id, prev ? { ...prev, ...app, description: app.description || prev.description } : app);
}

function parseListings(html: string, tag: string): PlayApp[] {
  const out: PlayApp[] = [];
  const seen = new Set<string>();
  const re = /href="\/store\/apps\/details\?id=([a-zA-Z][\w]*(?:\.[a-zA-Z][\w]*)+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const inner = m[2];
    const text = stripHtml(inner);
    const rated = inner.match(/Rated ([0-9.]+) stars/i)?.[1];
    const img = inner.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null;
    const titleMatch = inner.match(/class="[^"]*Epkrse[^"]*"[^>]*>([^<]+)/i);
    const name = decodeEntities((titleMatch?.[1] || text.split(" star")[0] || id).trim());
    if (!name || name.length < 2) continue;
    out.push({
      id,
      name: name.replace(/\s+\d\.\d$/, "").trim(),
      icon: img,
      category: tag,
      rating: rated ? Number(rated) : null,
      ratingsLabel: null,
      description: "",
      developer: null,
      installs: null,
      url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`,
    });
  }
  return out;
}

function parseDetails(html: string, id: string): Partial<PlayApp> {
  const name = decodeEntities(html.match(/itemprop="name">([^<]+)/)?.[1] ?? "");
  const descHtml = html.match(/itemprop="description"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  const description = stripHtml(descHtml).slice(0, 1_600);
  const rating = Number(html.match(/Rated ([0-9.]+) stars out of five stars/i)?.[1] ?? "");
  const reviewsLabel = html.match(/class="g1rdde">([^<]+)<\/div>/)?.[1] ?? null;
  const installs = html.match(/([0-9][0-9.,]*\s*[KMB]?\+?)<\/div>\s*<div[^>]*>Downloads/i)?.[1]
    ?? html.match(/([0-9][0-9.,]*[KMB]?\+)\s*downloads/i)?.[1]
    ?? null;
  const icon = html.match(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"[^>]{0,200}(?:alt="[^"]*"|itemprop="image")/i)?.[1]
    ?? html.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"]+=s256[^"]*/)?.[0]
    ?? null;
  const developer = decodeEntities(
    html.match(/href="\/store\/apps\/dev(?:eloper)?\?id=[^"]+">([^<]+)/)?.[1]
      ?? html.match(/href="\/store\/apps\/developer\?id=[^"]+">([^<]+)/)?.[1]
      ?? "",
  ) || null;
  return {
    id,
    name: name || undefined,
    description,
    rating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
    ratingsLabel: reviewsLabel,
    installs: installs ? stripHtml(installs) : null,
    icon,
    developer,
    url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`,
  };
}

function parsePlayReviews(html: string, id: string): ReviewSnippet[] {
  const bodies = [...html.matchAll(/class="h3YV2d"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => stripHtml(m[1]));
  const out: ReviewSnippet[] = [];
  const NEG =
    /\b(ads?|crash|bug|slow|refund|cancel|paywall|expensive|broken|hate|worst|unusable|force|bloat|login|account|ban)\b/i;
  for (const body of bodies) {
    if (body.length < 40) continue;
    if (!NEG.test(body) && out.length >= 2) continue;
    out.push({
      source: "Play Store",
      title: NEG.test(body) ? "Critical review" : "User review",
      url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`,
      body: body.slice(0, 420),
    });
    if (out.length >= 8) break;
  }
  return out;
}

function toHit(app: PlayApp): ScoutHit {
  const flinch = (app.rating ?? 5) < 4.55;
  return {
    kind: "playstore",
    id: app.id,
    name: app.name,
    description: app.description.slice(0, 220) || `${app.category ?? "Android"} · ${formatRating(app.rating)} on Play`,
    icon: app.icon,
    category: app.category,
    sourceUrl: app.url,
    stats: [
      { label: "Rating", value: formatRating(app.rating), tone: flinch ? "pain" : "money" },
      { label: "Chart", value: app.category ?? "Play" },
    ],
    badges: [app.category ?? "Play", ...(flinch ? ["Open flank"] : [])],
    tags: [app.category ?? "play", flinch ? "flinch" : "solid"],
    painPreview: flinch ? `${formatRating(app.rating)} stars on a charting Android app.` : null,
  };
}

export async function loadPlayStoreFeed(): Promise<ScoutHit[]> {
  const cached = readCache<ScoutHit[]>("desk:playstore", 10 * 60_000);
  if (cached) return cached;

  const pages = await Promise.all(
    CATEGORIES.map(async (c) => {
      const html = await fetchText(`https://play.google.com/store/apps/category/${c.path}?hl=en&gl=us`, {
        timeoutMs: 10_000,
        ua: BROWSER_UA,
        maxBytes: 1_800_000,
      });
      return html ? parseListings(html, c.tag) : [];
    }),
  );

  const merged = new Map<string, PlayApp>();
  for (const list of pages) {
    for (const app of list) {
      if (!merged.has(app.id)) merged.set(app.id, app);
    }
  }
  const apps = Array.from(merged.values());
  for (const app of apps) remember(app);

  const hits = apps
    .filter((a) => a.rating != null)
    .sort((a, b) => (a.rating ?? 5) - (b.rating ?? 5) || a.name.localeCompare(b.name))
    .slice(0, 36)
    .map(toHit);

  return writeCache("desk:playstore", hits);
}

export async function loadPlayStoreProfile(id: string): Promise<{ profile: TargetProfile; reviews: ReviewSnippet[] }> {
  const key = `play:${id}`;
  const cached = readCache<{ profile: TargetProfile; reviews: ReviewSnippet[] }>(key, 12 * 60_000);
  if (cached) return cached;

  const html = await fetchText(`https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=en&gl=us`, {
    timeoutMs: 12_000,
    ua: BROWSER_UA,
    maxBytes: 1_800_000,
  });
  if (!html) throw new Error("Google Play did not return this listing.");

  const parsed = parseDetails(html, id);
  const listed = appCache.get(id);
  const app: PlayApp = {
    id,
    name: parsed.name || listed?.name || id,
    icon: parsed.icon || listed?.icon || null,
    category: listed?.category ?? null,
    rating: parsed.rating ?? listed?.rating ?? null,
    ratingsLabel: parsed.ratingsLabel ?? null,
    description: parsed.description || listed?.description || "",
    developer: parsed.developer || listed?.developer || null,
    installs: parsed.installs || null,
    url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`,
  };
  remember(app);
  const reviews = parsePlayReviews(html, id);

  const profile = emptyTarget({
    kind: "playstore",
    id: app.id,
    name: app.name,
    description: app.description.slice(0, 1_200),
    icon: app.icon,
    category: app.category,
    website: app.url,
    sourceUrl: app.url,
    sourceLabel: "Play Store",
    developer: app.developer,
    extra: { installs: app.installs ?? "", ratings: app.ratingsLabel ?? "" },
    rating: app.rating,
    installs: app.installs,
  });

  const value = { profile, reviews };
  return writeCache(key, value);
}
