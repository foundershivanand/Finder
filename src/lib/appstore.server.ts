import { formatCount, formatRating } from "./format";
import { fetchJson, readCache, stripHtml, writeCache } from "./http.server";
import { emptyTarget } from "./profile";
import type { ReviewSnippet, ScoutHit, TargetProfile } from "./types";

type IosApp = {
  id: string;
  name: string;
  artist: string;
  summary: string;
  icon: string | null;
  category: string | null;
  url: string;
  price: string;
  rank: number;
  chart: string;
  rating: number | null;
  ratingsCount: number | null;
  bundleId: string | null;
};

const appCache = new Map<string, IosApp>();

function remember(app: IosApp) {
  const prev = appCache.get(app.id);
  appCache.set(app.id, prev ? { ...prev, ...app, summary: app.summary || prev.summary } : app);
}

function label(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const rec = node as Record<string, unknown>;
  return typeof rec.label === "string" ? rec.label : "";
}

function attr(node: unknown, key: string): string {
  if (!node || typeof node !== "object") return "";
  const rec = node as Record<string, unknown>;
  const attributes = rec.attributes as Record<string, unknown> | undefined;
  const v = attributes?.[key];
  return typeof v === "string" ? v : "";
}

function parseFeed(json: unknown, chart: string): IosApp[] {
  if (!json || typeof json !== "object") return [];
  const feed = (json as { feed?: { entry?: unknown } }).feed;
  const entry = feed?.entry;
  const rows = Array.isArray(entry) ? entry : entry ? [entry] : [];
  const out: IosApp[] = [];
  let rank = 0;
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const id = attr(rec.id, "im:id") || label(rec.id).match(/id(\d+)/)?.[1] || "";
    const name = label(rec["im:name"]) || label(rec.title);
    if (!id || !name) continue;
    rank += 1;
    const images = rec["im:image"];
    const imgList = Array.isArray(images) ? images : [];
    const icon = imgList.length ? label(imgList[imgList.length - 1]) : null;
    const links = rec.link;
    const linkArr = Array.isArray(links) ? links : links ? [links] : [];
    const href = linkArr.map((l) => attr(l, "href")).find(Boolean) || "";
    out.push({
      id,
      name,
      artist: label(rec["im:artist"]),
      summary: label(rec.summary),
      icon,
      category: attr(rec.category, "label") || null,
      url: href || `https://apps.apple.com/us/app/id${id}`,
      price: label(rec["im:price"]) || "Get",
      rank,
      chart,
      rating: null,
      ratingsCount: null,
      bundleId: null,
    });
  }
  return out;
}

async function lookup(ids: string[]): Promise<Map<string, { rating: number; count: number; bundleId: string; description: string }>> {
  const map = new Map<string, { rating: number; count: number; bundleId: string; description: string }>();
  if (!ids.length) return map;
  const json = await fetchJson(`https://itunes.apple.com/lookup?id=${ids.join(",")}&country=us`, { timeoutMs: 10_000 });
  const results = json && typeof json === "object" ? (json as { results?: unknown[] }).results : null;
  if (!Array.isArray(results)) return map;
  for (const item of results) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const id = String(rec.trackId ?? "");
    if (!id) continue;
    map.set(id, {
      rating: Number(rec.averageUserRating ?? 0) || 0,
      count: Number(rec.userRatingCount ?? 0) || 0,
      bundleId: String(rec.bundleId ?? ""),
      description: String(rec.description ?? ""),
    });
  }
  return map;
}

function opportunity(app: IosApp): number {
  const count = Math.max(app.ratingsCount ?? 0, 10);
  const rating = app.rating ?? 4.6;
  return Math.log10(count) * Math.max(5 - rating, 0.12);
}

function toHit(app: IosApp): ScoutHit {
  const flinch = (app.rating ?? 5) < 4.55;
  const badges = [app.chart];
  if (flinch) badges.push("Open flank");
  return {
    kind: "appstore",
    id: app.id,
    name: app.name,
    description: app.summary.slice(0, 220) || `${app.artist} · ${app.category ?? "iOS"}`,
    icon: app.icon,
    category: app.category,
    sourceUrl: app.url,
    stats: [
      { label: "Rating", value: formatRating(app.rating), tone: flinch ? "pain" : "money" },
      { label: "Ratings", value: formatCount(app.ratingsCount) },
      { label: "Chart", value: `#${app.rank}` },
    ],
    badges,
    tags: [app.chart, flinch ? "flinch" : "solid"],
    painPreview: flinch ? `${formatRating(app.rating)} stars with ${formatCount(app.ratingsCount)} ratings — room to steal.` : null,
  };
}

export async function loadAppStoreFeed(): Promise<ScoutHit[]> {
  const cached = readCache<ScoutHit[]>("desk:appstore", 10 * 60_000);
  if (cached) return cached;

  const [gross, free, paid] = await Promise.all([
    fetchJson("https://itunes.apple.com/us/rss/topgrossingapplications/limit=25/json", { timeoutMs: 10_000 }),
    fetchJson("https://itunes.apple.com/us/rss/topfreeapplications/limit=18/json", { timeoutMs: 10_000 }),
    fetchJson("https://itunes.apple.com/us/rss/toppaidapplications/limit=12/json", { timeoutMs: 10_000 }),
  ]);

  const merged = new Map<string, IosApp>();
  for (const app of [
    ...parseFeed(gross, "Grossing"),
    ...parseFeed(free, "Free"),
    ...parseFeed(paid, "Paid"),
  ]) {
    const prev = merged.get(app.id);
    if (!prev) merged.set(app.id, app);
    else merged.set(app.id, { ...prev, rank: Math.min(prev.rank, app.rank), chart: prev.chart });
  }

  const ids = Array.from(merged.keys()).slice(0, 50);
  const meta = await lookup(ids);
  for (const [id, app] of merged) {
    const m = meta.get(id);
    if (m) {
      app.rating = m.rating;
      app.ratingsCount = m.count;
      app.bundleId = m.bundleId;
      if (m.description) app.summary = m.description.slice(0, 1_400);
    }
    remember(app);
  }

  const hits = Array.from(merged.values())
    .filter((a) => (a.ratingsCount ?? 0) >= 2_000)
    .sort((a, b) => opportunity(b) - opportunity(a))
    .slice(0, 30)
    .map(toHit);

  return writeCache("desk:appstore", hits);
}

function parseReviews(json: unknown, appId: string): ReviewSnippet[] {
  if (!json || typeof json !== "object") return [];
  const feed = (json as { feed?: { entry?: unknown } }).feed;
  const entry = feed?.entry;
  const rows = Array.isArray(entry) ? entry : entry ? [entry] : [];
  const out: ReviewSnippet[] = [];
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const ratingRaw = label(rec["im:rating"]);
    const rating = Number(ratingRaw);
    if (!Number.isFinite(rating) || rating > 3) continue;
    const title = label(rec.title) || `${rating}-star review`;
    const body = stripHtml(label(rec.content) || label(rec.summary));
    if (body.length < 24) continue;
    const author = label((rec.author as Record<string, unknown> | undefined)?.name) || "App Store";
    out.push({
      source: `App Store · ${rating}★`,
      title,
      url: `https://apps.apple.com/us/app/id${appId}`,
      body: `${title}. ${body}`.slice(0, 420),
    });
  }
  return out.slice(0, 10);
}

export async function loadAppStoreProfile(id: string): Promise<{ profile: TargetProfile; reviews: ReviewSnippet[] }> {
  const key = `ios:${id}`;
  const cached = readCache<{ profile: TargetProfile; reviews: ReviewSnippet[] }>(key, 12 * 60_000);
  if (cached) return cached;

  let app = appCache.get(id) ?? null;
  if (!app || app.rating == null) {
    const meta = await lookup([id]);
    const m = meta.get(id);
    const rss = await fetchJson(`https://itunes.apple.com/us/rss/topgrossingapplications/limit=25/json`, {
      timeoutMs: 8_000,
    });
    const fromChart = parseFeed(rss, "Grossing").find((a) => a.id === id);
    app = {
      id,
      name: fromChart?.name || "App Store listing",
      artist: fromChart?.artist || "",
      summary: m?.description || fromChart?.summary || "",
      icon: fromChart?.icon ?? null,
      category: fromChart?.category ?? null,
      url: fromChart?.url || `https://apps.apple.com/us/app/id${id}`,
      price: fromChart?.price || "Get",
      rank: fromChart?.rank ?? 0,
      chart: fromChart?.chart ?? "App Store",
      rating: m?.rating ?? null,
      ratingsCount: m?.count ?? null,
      bundleId: m?.bundleId ?? null,
    };
    if (m?.description) app.summary = m.description.slice(0, 1_800);
    remember(app);
  }

  const reviewsJson = await fetchJson(
    `https://itunes.apple.com/rss/customerreviews/id=${id}/sortBy=mostRecent/json`,
    { timeoutMs: 8_000 },
  );
  const reviews = parseReviews(reviewsJson, id);

  const profile = emptyTarget({
    kind: "appstore",
    id: app.id,
    name: app.name,
    description: app.summary.slice(0, 1_200),
    icon: app.icon,
    category: app.category,
    website: app.url,
    sourceUrl: app.url,
    sourceLabel: "App Store",
    developer: app.artist || null,
    extra: { bundleId: app.bundleId ?? "", chart: app.chart, price: app.price },
    rating: app.rating,
    ratingsCount: app.ratingsCount,
    rank: app.rank,
    price: app.price,
  });

  const value = { profile, reviews };
  return writeCache(key, value);
}
