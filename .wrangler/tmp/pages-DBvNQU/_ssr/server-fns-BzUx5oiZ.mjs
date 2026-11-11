import { a as formatUsd, c as isDeskKind, i as formatRating, l as isSafeHitId, n as formatCount, o as hitKey, u as isSafeSlug } from "./format-xEnlTVnE.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/server-fns-BzUx5oiZ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var cache$1 = /* @__PURE__ */ new Map();
var BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
function readCache$1(key, ttlMs) {
	const hit = cache$1.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > ttlMs) {
		cache$1.delete(key);
		return null;
	}
	return hit.value;
}
function writeCache$1(key, value) {
	cache$1.set(key, {
		at: Date.now(),
		value
	});
	return value;
}
async function fetchText$1(url, opts = {}) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": opts.ua ?? "Riposte/1.0 (https://grok.com; product research desk)",
				Accept: "text/html,application/json,application/xml;q=0.9,*/*;q=0.8",
				...opts.headers
			},
			signal: AbortSignal.timeout(opts.timeoutMs ?? 8e3),
			redirect: "follow"
		});
		if (!res.ok) return null;
		const buf = await res.arrayBuffer();
		const cap = opts.maxBytes ?? 4e5;
		const slice = buf.byteLength > cap ? buf.slice(0, cap) : buf;
		return new TextDecoder("utf-8", { fatal: false }).decode(slice);
	} catch {
		return null;
	}
}
async function fetchJson$1(url, opts) {
	const text = await fetchText$1(url, {
		timeoutMs: opts?.timeoutMs ?? 1e4,
		ua: opts?.ua,
		maxBytes: opts?.maxBytes,
		headers: { Accept: "application/json" }
	});
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function decodeEntities$1(html) {
	return html.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/"/gi, "\"").replace(/&#39;|'/gi, "'").replace(/</gi, "<").replace(/>/gi, ">").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(Number.parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function stripHtml$1(html) {
	return decodeEntities$1(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
var ZERO_REVENUE = {
	last30Days: 0,
	mrr: 0,
	total: 0
};
function emptyTarget(partial) {
	return {
		description: "",
		icon: null,
		category: null,
		website: null,
		sourceUrl: "",
		sourceLabel: "Riposte",
		developer: null,
		extra: {},
		revenue: ZERO_REVENUE,
		growth30d: null,
		growthMRR30d: null,
		onSale: false,
		stealthMode: false,
		rating: null,
		ratingsCount: null,
		rank: null,
		installs: null,
		price: null,
		score: null,
		comments: null,
		subreddit: null,
		insights: {},
		techStack: {},
		marketingChannels: [],
		github: null,
		domainRating: null,
		estimatedUsers: null,
		...partial
	};
}
function fromTrustProfile(p) {
	return emptyTarget({
		kind: "trustmrr",
		id: p.slug,
		name: p.name,
		description: p.description,
		icon: p.icon,
		category: p.category,
		website: p.website,
		sourceUrl: p.trustmrrUrl,
		sourceLabel: "TrustMRR",
		developer: p.founder,
		extra: {
			country: p.country ?? "",
			founded: p.foundedDate ?? "",
			...p.insights
		},
		revenue: p.revenue,
		growth30d: p.growth30d,
		growthMRR30d: p.growthMRR30d,
		onSale: p.onSale,
		stealthMode: p.stealthMode,
		insights: p.insights,
		techStack: p.techStack,
		marketingChannels: p.marketingChannels,
		github: p.github,
		domainRating: p.domainRating,
		estimatedUsers: p.estimatedUsers
	});
}
var appCache$1 = /* @__PURE__ */ new Map();
function remember$3(app) {
	const prev = appCache$1.get(app.id);
	appCache$1.set(app.id, prev ? {
		...prev,
		...app,
		summary: app.summary || prev.summary
	} : app);
}
function label(node) {
	if (!node || typeof node !== "object") return "";
	const rec = node;
	return typeof rec.label === "string" ? rec.label : "";
}
function attr(node, key) {
	if (!node || typeof node !== "object") return "";
	const v = node.attributes?.[key];
	return typeof v === "string" ? v : "";
}
function parseFeed(json, chart) {
	if (!json || typeof json !== "object") return [];
	const entry = json.feed?.entry;
	const rows = Array.isArray(entry) ? entry : entry ? [entry] : [];
	const out = [];
	let rank = 0;
	for (const item of rows) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const id = attr(rec.id, "im:id") || label(rec.id).match(/id(\d+)/)?.[1] || "";
		const name = label(rec["im:name"]) || label(rec.title);
		if (!id || !name) continue;
		rank += 1;
		const images = rec["im:image"];
		const imgList = Array.isArray(images) ? images : [];
		const icon = imgList.length ? label(imgList[imgList.length - 1]) : null;
		const links = rec.link;
		const href = (Array.isArray(links) ? links : links ? [links] : []).map((l) => attr(l, "href")).find(Boolean) || "";
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
			bundleId: null
		});
	}
	return out;
}
async function lookup(ids) {
	const map = /* @__PURE__ */ new Map();
	if (!ids.length) return map;
	const json = await fetchJson$1(`https://itunes.apple.com/lookup?id=${ids.join(",")}&country=us`, { timeoutMs: 1e4 });
	const results = json && typeof json === "object" ? json.results : null;
	if (!Array.isArray(results)) return map;
	for (const item of results) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const id = String(rec.trackId ?? "");
		if (!id) continue;
		map.set(id, {
			rating: Number(rec.averageUserRating ?? 0) || 0,
			count: Number(rec.userRatingCount ?? 0) || 0,
			bundleId: String(rec.bundleId ?? ""),
			description: String(rec.description ?? "")
		});
	}
	return map;
}
function opportunity(app) {
	const count = Math.max(app.ratingsCount ?? 0, 10);
	const rating = app.rating ?? 4.6;
	return Math.log10(count) * Math.max(5 - rating, .12);
}
function toHit$2(app) {
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
			{
				label: "Rating",
				value: formatRating(app.rating),
				tone: flinch ? "pain" : "money"
			},
			{
				label: "Ratings",
				value: formatCount(app.ratingsCount)
			},
			{
				label: "Chart",
				value: `#${app.rank}`
			}
		],
		badges,
		tags: [app.chart, flinch ? "flinch" : "solid"],
		painPreview: flinch ? `${formatRating(app.rating)} stars with ${formatCount(app.ratingsCount)} ratings — room to steal.` : null
	};
}
async function loadAppStoreFeed() {
	const cached = readCache$1("desk:appstore", 6e5);
	if (cached) return cached;
	const [gross, free, paid] = await Promise.all([
		fetchJson$1("https://itunes.apple.com/us/rss/topgrossingapplications/limit=25/json", { timeoutMs: 1e4 }),
		fetchJson$1("https://itunes.apple.com/us/rss/topfreeapplications/limit=18/json", { timeoutMs: 1e4 }),
		fetchJson$1("https://itunes.apple.com/us/rss/toppaidapplications/limit=12/json", { timeoutMs: 1e4 })
	]);
	const merged = /* @__PURE__ */ new Map();
	for (const app of [
		...parseFeed(gross, "Grossing"),
		...parseFeed(free, "Free"),
		...parseFeed(paid, "Paid")
	]) {
		const prev = merged.get(app.id);
		if (!prev) merged.set(app.id, app);
		else merged.set(app.id, {
			...prev,
			rank: Math.min(prev.rank, app.rank),
			chart: prev.chart
		});
	}
	const meta = await lookup(Array.from(merged.keys()).slice(0, 50));
	for (const [id, app] of merged) {
		const m = meta.get(id);
		if (m) {
			app.rating = m.rating;
			app.ratingsCount = m.count;
			app.bundleId = m.bundleId;
			if (m.description) app.summary = m.description.slice(0, 1400);
		}
		remember$3(app);
	}
	return writeCache$1("desk:appstore", Array.from(merged.values()).filter((a) => (a.ratingsCount ?? 0) >= 2e3).sort((a, b) => opportunity(b) - opportunity(a)).slice(0, 30).map(toHit$2));
}
function parseReviews(json, appId) {
	if (!json || typeof json !== "object") return [];
	const entry = json.feed?.entry;
	const rows = Array.isArray(entry) ? entry : entry ? [entry] : [];
	const out = [];
	for (const item of rows) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const ratingRaw = label(rec["im:rating"]);
		const rating = Number(ratingRaw);
		if (!Number.isFinite(rating) || rating > 3) continue;
		const title = label(rec.title) || `${rating}-star review`;
		const body = stripHtml$1(label(rec.content) || label(rec.summary));
		if (body.length < 24) continue;
		label(rec.author?.name);
		out.push({
			source: `App Store · ${rating}★`,
			title,
			url: `https://apps.apple.com/us/app/id${appId}`,
			body: `${title}. ${body}`.slice(0, 420)
		});
	}
	return out.slice(0, 10);
}
async function loadAppStoreProfile(id) {
	const key = `ios:${id}`;
	const cached = readCache$1(key, 72e4);
	if (cached) return cached;
	let app = appCache$1.get(id) ?? null;
	if (!app || app.rating == null) {
		const m = (await lookup([id])).get(id);
		const fromChart = parseFeed(await fetchJson$1(`https://itunes.apple.com/us/rss/topgrossingapplications/limit=25/json`, { timeoutMs: 8e3 }), "Grossing").find((a) => a.id === id);
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
			bundleId: m?.bundleId ?? null
		};
		if (m?.description) app.summary = m.description.slice(0, 1800);
		remember$3(app);
	}
	const reviews = parseReviews(await fetchJson$1(`https://itunes.apple.com/rss/customerreviews/id=${id}/sortBy=mostRecent/json`, { timeoutMs: 8e3 }), id);
	return writeCache$1(key, {
		profile: emptyTarget({
			kind: "appstore",
			id: app.id,
			name: app.name,
			description: app.summary.slice(0, 1200),
			icon: app.icon,
			category: app.category,
			website: app.url,
			sourceUrl: app.url,
			sourceLabel: "App Store",
			developer: app.artist || null,
			extra: {
				bundleId: app.bundleId ?? "",
				chart: app.chart,
				price: app.price
			},
			rating: app.rating,
			ratingsCount: app.ratingsCount,
			rank: app.rank,
			price: app.price
		}),
		reviews
	});
}
var IDEA_KINDS = [
	"producthunt",
	"twitter",
	"hackernews",
	"github",
	"betalist",
	"lobsters",
	"devto",
	"firefox",
	"launchingnext"
];
function isIdeaKind(kind) {
	return IDEA_KINDS.includes(kind);
}
var records = /* @__PURE__ */ new Map();
function keyOf(kind, id) {
	return `${kind}:${id}`;
}
function remember$2(row) {
	records.set(keyOf(row.hit.kind, row.hit.id), row);
}
function peekIdea(kind, id) {
	return records.get(keyOf(kind, id)) ?? null;
}
function tagInner(block, tag) {
	const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
	return m ? stripHtml$1(m[1]) : "";
}
function attrHref(block) {
	return ((block.match(/<link[^>]+href=["']([^"']+)["']/i) || block.match(/<link>([^<]+)<\/link>/i))?.[1] ?? "").trim();
}
function parseFeedEntries(xml) {
	const chunks = [...xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").matchAll(/<(?:entry|item)[\s\S]*?<\/(?:entry|item)>/gi)].map((m) => m[0]);
	const out = [];
	for (const block of chunks) {
		const title = tagInner(block, "title");
		const link = attrHref(block).replace(/#m$/, "");
		const guid = tagInner(block, "guid") || tagInner(block, "id") || link;
		const body = stripHtml$1(tagInner(block, "content") || tagInner(block, "description") || tagInner(block, "summary"));
		const author = tagInner(block, "name") || tagInner(block, "dc:creator") || tagInner(block, "author");
		const date = tagInner(block, "updated") || tagInner(block, "published") || tagInner(block, "pubDate");
		if (!title || title.length < 3) continue;
		out.push({
			id: guid,
			title,
			link,
			body,
			author,
			date
		});
	}
	return out;
}
function loc(value) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const rec = value;
		const v = rec["en-US"] ?? rec.en ?? Object.values(rec)[0];
		return typeof v === "string" ? v : "";
	}
	return "";
}
function tweetIdFrom(entry) {
	const fromGuid = entry.id.match(/(\d{15,22})/);
	if (fromGuid) return fromGuid[1];
	return entry.link.match(/status\/(\d{15,22})/)?.[1] ?? null;
}
var NSFW = /\b(onlyfans|porn|nsfw|nude|xxx|loli|underage|identity preservation|genjutsu|reference image of the girl)\b/i;
var DEMAND$1 = /\b(i wish|looking for|need an? (app|tool|site)|is there an? (app|tool)|someone (please )?make|somebody make|app idea|build me|why isn'?t there|alternative to|micro-?saas|i would pay)\b/i;
function hitCard(kind, id, name, description, sourceUrl, opts) {
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
		painPreview: opts.pain ?? description.slice(0, 180)
	};
}
async function loadProductHunt() {
	const xml = await fetchText$1("https://www.producthunt.com/feed", {
		timeoutMs: 1e4,
		ua: BROWSER_UA
	});
	if (!xml) throw new Error("Product Hunt feed was quiet.");
	const hits = [];
	for (const e of parseFeedEntries(xml)) {
		const slug = e.link.match(/producthunt\.com\/products\/([a-z0-9-]+)/i)?.[1];
		if (!slug) continue;
		const url = `https://www.producthunt.com/products/${slug}`;
		const desc = e.body.replace(/Discussion\s*\|\s*Link/i, "").trim();
		const hit = hitCard("producthunt", slug, e.title.trim(), desc || "A Product Hunt launch.", url, {
			category: "Product Hunt",
			stats: [{
				label: "Maker",
				value: e.author || "—"
			}, {
				label: "Listed",
				value: e.date.slice(0, 10) || "—"
			}],
			badges: ["Launch"],
			pain: desc.slice(0, 180) || null
		});
		remember$2({
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
				extra: { published: e.date }
			}),
			reviews: desc ? [{
				source: "Product Hunt",
				title: e.title,
				url,
				body: desc.slice(0, 500)
			}] : []
		});
		hits.push(hit);
		if (hits.length >= 36) break;
	}
	return hits;
}
async function nitterRss(path) {
	const xml = await fetchText$1(`https://nitter.meowing.monster${path}`, {
		timeoutMs: 1e4,
		ua: BROWSER_UA
	});
	return xml ? parseFeedEntries(xml) : [];
}
async function loadTwitter() {
	const [wish, someone, looking, levelsio, ph] = await Promise.all([
		nitterRss("/search/rss?f=tweets&q=I%20wish%20there%20was%20an%20app"),
		nitterRss("/search/rss?f=tweets&q=someone%20should%20make"),
		nitterRss("/search/rss?f=tweets&q=looking%20for%20a%20tool%20that"),
		nitterRss("/levelsio/rss"),
		nitterRss("/ProductHunt/rss")
	]);
	const builders = /* @__PURE__ */ new Set([
		"levelsio",
		"producthunt",
		"indiehackers",
		"ycombinator",
		"levelsio"
	]);
	const merged = [
		...wish,
		...someone,
		...looking,
		...levelsio,
		...ph
	];
	const seen = /* @__PURE__ */ new Set();
	const hits = [];
	for (const e of merged) {
		const id = tweetIdFrom(e);
		if (!id || seen.has(id)) continue;
		const handle = (e.author.replace(/^@/, "") || e.link.match(/nitter\.[^/]+\/([^/]+)\//)?.[1] || "user").replace(/^@/, "");
		const text = `${e.title} ${e.body}`.replace(/\s+/g, " ").trim();
		if (text.length < 40 || NSFW.test(text)) continue;
		const fromBuilder = builders.has(handle.toLowerCase());
		if (!fromBuilder && !DEMAND$1.test(text)) continue;
		seen.add(id);
		const url = `https://x.com/${handle}/status/${id}`;
		const name = e.title.replace(/\s+/g, " ").trim().slice(0, 110) || text.slice(0, 90);
		const hit = hitCard("twitter", id, name, text.slice(0, 280), url, {
			category: `@${handle}`,
			stats: [{
				label: "From",
				value: `@${handle}`
			}, {
				label: "Posted",
				value: e.date.slice(0, 16) || "—"
			}],
			badges: fromBuilder ? ["Builder"] : ["Ask"],
			pain: text.slice(0, 180)
		});
		remember$2({
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
				extra: { handle }
			}),
			reviews: [{
				source: `X · @${handle}`,
				title: name,
				url,
				body: text.slice(0, 700)
			}]
		});
		hits.push(hit);
		if (hits.length >= 40) break;
	}
	if (!hits.length) throw new Error("Twitter search did not return usable asks.");
	return hits;
}
async function loadHackerNews() {
	const [show, ask] = await Promise.all([fetchJson$1("https://hn.algolia.com/api/v1/search?tags=show_hn&hitsPerPage=25", { timeoutMs: 1e4 }), fetchJson$1("https://hn.algolia.com/api/v1/search?tags=ask_hn&hitsPerPage=15", { timeoutMs: 1e4 })]);
	const rows = [...show?.hits ?? [], ...ask?.hits ?? []];
	rows.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
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
			stats: [{
				label: "Points",
				value: formatCount(r.points)
			}, {
				label: "Comments",
				value: formatCount(r.num_comments)
			}],
			badges: [askPost ? "Ask" : "Show"],
			pain: desc.slice(0, 180)
		});
		remember$2({
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
				extra: { created: r.created_at ?? "" }
			}),
			reviews: []
		});
		hits.push(hit);
		if (hits.length >= 36) break;
	}
	if (!hits.length) throw new Error("Hacker News did not return stories.");
	return hits;
}
async function loadGitHub() {
	const items = ((await fetchJson$1("https://api.github.com/search/repositories?q=stars:400..80000+pushed:%3E2026-08-01+NOT+awesome+NOT+list&sort=stars&order=desc&per_page=30", {
		timeoutMs: 1e4,
		ua: "Riposte-Scout"
	}))?.items ?? []).filter((r) => {
		const n = `${r.full_name} ${r.description ?? ""}`.toLowerCase();
		return !/awesome-|awesome /i.test(n) && (r.description ?? "").length > 20;
	});
	const hits = [];
	for (const r of items) {
		const [owner, repo] = r.full_name.split("/");
		if (!owner || !repo) continue;
		const id = `${owner}~${repo}`;
		const url = r.html_url;
		const desc = (r.description ?? "").trim();
		const hit = hitCard("github", id, r.name, desc, url, {
			icon: r.owner?.avatar_url ?? null,
			category: r.language || "GitHub",
			stats: [{
				label: "Stars",
				value: formatCount(r.stargazers_count)
			}, {
				label: "Issues",
				value: formatCount(r.open_issues_count)
			}],
			badges: r.language ? [r.language] : ["Repo"],
			pain: desc.slice(0, 180)
		});
		remember$2({
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
				extra: {
					language: r.language ?? "",
					pushed: r.pushed_at ?? ""
				}
			}),
			reviews: []
		});
		hits.push(hit);
	}
	if (!hits.length) throw new Error("GitHub search was empty.");
	return hits;
}
async function loadBetaList() {
	const xml = await fetchText$1("https://feeds.feedburner.com/BetaList", {
		timeoutMs: 1e4,
		ua: BROWSER_UA
	});
	if (!xml) throw new Error("BetaList feed was quiet.");
	const hits = [];
	for (const e of parseFeedEntries(xml)) {
		const slug = e.link.match(/betalist\.com\/startups\/([a-z0-9-]+)/i)?.[1];
		if (!slug) continue;
		const url = `https://betalist.com/startups/${slug}`;
		const desc = e.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
		const name = e.title.replace(/\s+[–—].*/, "").trim() || e.title;
		const tagline = e.title.includes("–") || e.title.includes("—") ? e.title.replace(/^.*?[–—]\s*/, "") : desc;
		const hit = hitCard("betalist", slug, name, tagline || desc, url, {
			category: "BetaList",
			stats: [{
				label: "Listed",
				value: e.date.slice(0, 10) || "—"
			}, {
				label: "Desk",
				value: "Beta"
			}],
			badges: ["Startup"],
			pain: (tagline || desc).slice(0, 180)
		});
		remember$2({
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
				extra: { published: e.date }
			}),
			reviews: [{
				source: "BetaList",
				title: name,
				url,
				body: (tagline || desc).slice(0, 500)
			}]
		});
		hits.push(hit);
		if (hits.length >= 30) break;
	}
	if (!hits.length) throw new Error("BetaList had no launches.");
	return hits;
}
async function loadLobsters() {
	const json = await fetchJson$1("https://lobste.rs/hottest.json", {
		timeoutMs: 1e4,
		ua: BROWSER_UA
	});
	const rows = Array.isArray(json) ? json : [];
	const hits = [];
	for (const r of rows) {
		const id = r.short_id;
		const title = (r.title ?? "").trim();
		if (!id || !title || /what are you doing this (weekend|week)/i.test(title)) continue;
		const url = `https://lobste.rs/s/${id}`;
		const desc = (r.description || title).replace(/\s+/g, " ").trim();
		const hit = hitCard("lobsters", id, title, desc, url, {
			category: (r.tags ?? []).slice(0, 2).join(" · ") || "Lobsters",
			stats: [{
				label: "Score",
				value: formatCount(r.score)
			}, {
				label: "Comments",
				value: formatCount(r.comment_count)
			}],
			badges: (r.tags ?? []).slice(0, 2),
			pain: desc.slice(0, 180)
		});
		remember$2({
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
				comments: r.comment_count
			}),
			reviews: []
		});
		hits.push(hit);
		if (hits.length >= 30) break;
	}
	if (!hits.length) throw new Error("Lobsters was empty.");
	return hits;
}
async function loadDevto() {
	const [a, b] = await Promise.all([fetchJson$1("https://dev.to/api/articles?tag=showdev&per_page=20", { timeoutMs: 1e4 }), fetchJson$1("https://dev.to/api/articles?tag=sideprojects&per_page=15", { timeoutMs: 1e4 })]);
	const rows = [...Array.isArray(a) ? a : [], ...Array.isArray(b) ? b : []];
	const seen = /* @__PURE__ */ new Set();
	const hits = [];
	for (const r of rows) {
		if (!r.id || seen.has(r.id) || !r.title) continue;
		seen.add(r.id);
		const tags = Array.isArray(r.tag_list) ? r.tag_list : String(r.tag_list ?? "").split(",").map((t) => t.trim());
		const id = String(r.id);
		const hit = hitCard("devto", id, r.title, r.description || "A DEV show-and-tell.", r.url, {
			icon: r.user?.profile_image_90 ?? r.cover_image ?? null,
			category: tags[0] || "DEV",
			stats: [{
				label: "Reactions",
				value: formatCount(r.positive_reactions_count)
			}, {
				label: "Comments",
				value: formatCount(r.comments_count)
			}],
			badges: tags.filter(Boolean).slice(0, 2),
			pain: (r.description || "").slice(0, 180) || null
		});
		remember$2({
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
				comments: r.comments_count ?? 0
			}),
			reviews: [{
				source: "DEV",
				title: r.title,
				url: r.url,
				body: (r.description || r.title).slice(0, 500)
			}]
		});
		hits.push(hit);
		if (hits.length >= 32) break;
	}
	if (!hits.length) throw new Error("DEV.to had no showdev posts.");
	return hits;
}
async function loadFirefox() {
	const rows = ((await fetchJson$1("https://addons.mozilla.org/api/v5/addons/search/?page_size=20&sort=users&type=extension&lang=en-US", {
		timeoutMs: 1e4,
		ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
		maxBytes: 15e5
	}))?.results ?? []).filter((a) => a.slug && loc(a.name));
	const hits = [];
	for (const a of rows) {
		const users = a.average_daily_users ?? 0;
		const rating = a.ratings?.average ?? 0;
		if (users < 3e3) continue;
		const name = loc(a.name);
		const summary = loc(a.summary);
		const url = a.url || `https://addons.mozilla.org/firefox/addon/${a.slug}/`;
		const openFlank = rating > 0 && rating < 4.55;
		const hit = hitCard("firefox", a.slug, name, summary || "A popular Firefox add-on.", url, {
			icon: a.icon_url ?? null,
			category: a.categories?.[0] ?? "Add-on",
			stats: [{
				label: "Users",
				value: formatCount(users)
			}, {
				label: "Rating",
				value: formatRating(rating)
			}],
			badges: [openFlank ? "Open flank" : "Popular", ...a.requires_payment ? ["Paid"] : []],
			pain: summary.slice(0, 180) || null
		});
		const homepage = typeof a.homepage === "string" ? a.homepage : a.homepage?.url;
		remember$2({
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
				installs: formatCount(users)
			}),
			reviews: summary ? [{
				source: "Firefox Add-ons",
				title: name,
				url,
				body: summary.slice(0, 500)
			}] : []
		});
		hits.push(hit);
		if (hits.length >= 30) break;
	}
	if (!hits.length) throw new Error("Firefox add-ons search was empty.");
	return hits.sort((a, b) => {
		const af = a.badges.includes("Open flank") ? 1 : 0;
		return (b.badges.includes("Open flank") ? 1 : 0) - af;
	});
}
async function loadLaunchingNext() {
	const html = await fetchText$1("https://www.launchingnext.com/", {
		timeoutMs: 1e4,
		ua: BROWSER_UA,
		maxBytes: 25e4
	});
	if (!html) throw new Error("Launching Next was quiet.");
	const cards = [...html.matchAll(/<h3>([^<]+)<\/h3>\s*<p class="card-text">([\s\S]*?)<\/p>\s*<a class="stretched-link" href="(\/s\/[^"]+)"/gi)];
	const hits = [];
	for (const m of cards) {
		const name = stripHtml$1(m[1] ?? "").trim();
		const desc = stripHtml$1(m[2] ?? "").trim();
		const path = m[3] ?? "";
		const parts = path.match(/\/s\/([a-z0-9-]+)\/(\d+)/i);
		if (!name || !parts) continue;
		const id = `${parts[1]}~${parts[2]}`;
		const url = `https://www.launchingnext.com${path}`;
		const hit = hitCard("launchingnext", id, name, desc || "A new launch.", url, {
			category: "Launching Next",
			stats: [{
				label: "Desk",
				value: "New"
			}, {
				label: "Source",
				value: "LN"
			}],
			badges: ["Launch"],
			pain: desc.slice(0, 180) || null
		});
		remember$2({
			hit,
			profile: emptyTarget({
				kind: "launchingnext",
				id,
				name,
				description: desc,
				category: "Launching Next",
				website: url,
				sourceUrl: url,
				sourceLabel: "Launching Next"
			}),
			reviews: desc ? [{
				source: "Launching Next",
				title: name,
				url,
				body: desc.slice(0, 500)
			}] : []
		});
		hits.push(hit);
		if (hits.length >= 28) break;
	}
	if (!hits.length) throw new Error("Launching Next had no cards.");
	return hits;
}
var loaders = {
	producthunt: loadProductHunt,
	twitter: loadTwitter,
	hackernews: loadHackerNews,
	github: loadGitHub,
	betalist: loadBetaList,
	lobsters: loadLobsters,
	devto: loadDevto,
	firefox: loadFirefox,
	launchingnext: loadLaunchingNext
};
async function loadIdeaFeed(kind) {
	const cached = readCache$1(`idea:${kind}`, 12e5);
	if (cached?.length) return cached;
	const loader = loaders[kind];
	if (!loader) throw new Error("Unknown desk");
	const hits = await loader();
	return writeCache$1(`idea:${kind}`, hits);
}
async function enrichTwitter(id) {
	const tweet = (await fetchJson$1(`https://api.fxtwitter.com/status/${id}`, {
		timeoutMs: 8e3,
		ua: BROWSER_UA
	}))?.tweet;
	if (!tweet) return null;
	const text = String(tweet.text ?? "").trim();
	const handle = (tweet.author ?? {}).screen_name || "user";
	const url = String(tweet.url ?? `https://x.com/${handle}/status/${id}`);
	const name = text.slice(0, 110) || `Tweet by @${handle}`;
	const row = {
		hit: hitCard("twitter", id, name, text.slice(0, 280), url, {
			category: `@${handle}`,
			stats: [{
				label: "From",
				value: `@${handle}`
			}],
			badges: ["Ask"],
			pain: text.slice(0, 180)
		}),
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
			extra: { handle }
		}),
		reviews: [{
			source: `X · @${handle}`,
			title: name,
			url,
			body: text.slice(0, 800)
		}]
	};
	remember$2(row);
	return row;
}
async function enrichHackerNews(id, base) {
	const json = await fetchJson$1(`https://hn.algolia.com/api/v1/items/${id}`, { timeoutMs: 1e4 });
	if (!json || typeof json !== "object") return base?.reviews ?? [];
	const rec = json;
	const reviews = [];
	if (rec.text) reviews.push({
		source: "Hacker News",
		title: rec.title || "Story",
		url: `https://news.ycombinator.com/item?id=${id}`,
		body: stripHtml$1(rec.text).slice(0, 700)
	});
	for (const c of rec.children ?? []) {
		const body = stripHtml$1(c.text ?? "");
		if (body.length < 40) continue;
		reviews.push({
			source: `HN · ${c.author ?? "comment"}`,
			title: "Comment",
			url: `https://news.ycombinator.com/item?id=${id}`,
			body: body.slice(0, 500)
		});
		if (reviews.length >= 8) break;
	}
	return reviews;
}
async function enrichGitHub(id, base) {
	const [owner, repo] = id.split("~");
	if (!owner || !repo) return base?.reviews ?? [];
	const json = await fetchJson$1(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=8`, {
		timeoutMs: 1e4,
		ua: "Riposte-Scout"
	});
	const issues = Array.isArray(json) ? json : [];
	const reviews = [];
	for (const issue of issues) {
		const rec = issue;
		if (rec.pull_request) continue;
		const body = `${rec.title ?? ""}. ${stripHtml$1(rec.body ?? "")}`.replace(/\s+/g, " ").trim();
		if (body.length < 30) continue;
		reviews.push({
			source: "GitHub Issues",
			title: rec.title || "Issue",
			url: rec.html_url || `https://github.com/${owner}/${repo}`,
			body: body.slice(0, 500)
		});
	}
	return reviews;
}
async function enrichLobsters(id) {
	const rec = await fetchJson$1(`https://lobste.rs/s/${id}.json`, {
		timeoutMs: 8e3,
		ua: BROWSER_UA
	});
	const reviews = [];
	for (const c of rec?.comments ?? []) {
		const body = stripHtml$1(c.comment ?? "");
		if (body.length < 40) continue;
		reviews.push({
			source: `Lobsters · ${c.commenting_user?.username ?? "user"}`,
			title: "Comment",
			url: `https://lobste.rs/s/${id}`,
			body: body.slice(0, 500)
		});
		if (reviews.length >= 8) break;
	}
	return reviews;
}
async function enrichGitHubRepo(id) {
	const [owner, repo] = id.split("~");
	if (!owner || !repo) return null;
	const json = await fetchJson$1(`https://api.github.com/repos/${owner}/${repo}`, {
		timeoutMs: 8e3,
		ua: "Riposte-Scout"
	});
	if (!json || typeof json !== "object") return null;
	const r = json;
	const desc = (r.description ?? "").trim() || `${r.full_name} on GitHub`;
	const url = r.html_url || `https://github.com/${owner}/${repo}`;
	const row = {
		hit: hitCard("github", id, r.name || repo, desc, url, {
			icon: r.owner?.avatar_url ?? null,
			category: r.language || "GitHub",
			stats: [{
				label: "Stars",
				value: formatCount(r.stargazers_count)
			}],
			badges: r.language ? [r.language] : ["Repo"]
		}),
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
			score: r.stargazers_count ?? 0
		}),
		reviews: []
	};
	remember$2(row);
	return row;
}
async function enrichHackerNewsStory(id) {
	const json = await fetchJson$1(`https://hn.algolia.com/api/v1/items/${id}`, { timeoutMs: 8e3 });
	if (!json || typeof json !== "object") return null;
	const rec = json;
	const title = (rec.title ?? "").replace(/^Show HN:\s*/i, "").replace(/^Ask HN:\s*/i, "").trim();
	if (!title) return null;
	const url = `https://news.ycombinator.com/item?id=${id}`;
	const desc = stripHtml$1(rec.text ?? title);
	const row = {
		hit: hitCard("hackernews", id, title, desc, url, {
			category: /^ask hn/i.test(rec.title ?? "") ? "Ask HN" : "Show HN",
			stats: [{
				label: "Points",
				value: formatCount(rec.points)
			}],
			badges: ["HN"]
		}),
		profile: emptyTarget({
			kind: "hackernews",
			id,
			name: title,
			description: desc,
			website: rec.url || url,
			sourceUrl: url,
			sourceLabel: "Hacker News",
			developer: rec.author ?? null,
			score: rec.points ?? 0
		}),
		reviews: []
	};
	remember$2(row);
	return row;
}
async function enrichFirefox(id) {
	const json = await fetchJson$1(`https://addons.mozilla.org/api/v5/addons/addon/${id}/`, {
		timeoutMs: 8e3,
		ua: BROWSER_UA
	});
	if (!json || typeof json !== "object") return null;
	const a = json;
	const name = loc(a.name);
	if (!name) return null;
	const url = a.url || `https://addons.mozilla.org/firefox/addon/${id}/`;
	const summary = loc(a.summary);
	const row = {
		hit: hitCard("firefox", id, name, summary, url, {
			icon: a.icon_url ?? null,
			category: a.categories?.[0] ?? "Add-on",
			stats: [{
				label: "Users",
				value: formatCount(a.average_daily_users)
			}, {
				label: "Rating",
				value: formatRating(a.ratings?.average)
			}]
		}),
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
			installs: formatCount(a.average_daily_users)
		}),
		reviews: summary ? [{
			source: "Firefox Add-ons",
			title: name,
			url,
			body: summary.slice(0, 500)
		}] : []
	};
	remember$2(row);
	return row;
}
async function loadIdeaProfile(kind, id) {
	if (!peekIdea(kind, id)) try {
		await loadIdeaFeed(kind);
	} catch {}
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
	if (reviews.length) row = {
		...row,
		reviews
	};
	remember$2(row);
	return {
		profile: row.profile,
		reviews
	};
}
function platformOf(profile) {
	if (profile.kind === "appstore" || profile.kind === "playstore") return "ANDROID APP / IOS APP";
	return "WEB APP / SAAS";
}
function rivalName(profile) {
	return profile.kind === "reddit" || profile.kind === "twitter" || profile.kind === "hackernews" ? "the missing product this thread describes" : profile.name;
}
function complaintList(complaints) {
	return complaints.map((c, i) => `${i + 1}. [${c.severity.toUpperCase()}] ${c.theme}\n   Quote (${c.sourced ? c.source : "inferred"}): ${c.quote}\n   Beat it: ${c.howToFix}`).join("\n");
}
function reviewList(reviews) {
	if (!reviews.length) return "(No public traces captured. Use inferred complaints only — do not invent fake quotes.)";
	return reviews.slice(0, 8).map((r) => `- [${r.source}] ${r.title}\n  ${r.url}\n  ${r.body}`).join("\n");
}
function metrics(profile) {
	return [
		profile.kind === "trustmrr" ? `Revenue 30d ${formatUsd(profile.revenue.last30Days)}, MRR ${formatUsd(profile.revenue.mrr)}` : null,
		profile.rating != null ? `Store rating ${formatRating(profile.rating)} (${formatCount(profile.ratingsCount)} ratings)` : null,
		profile.installs ? `Installs ${profile.installs}` : null,
		profile.score != null ? `Reddit score ${formatCount(profile.score)}, comments ${formatCount(profile.comments)}` : null,
		profile.rank ? `Chart rank #${profile.rank}` : null
	].filter(Boolean).join(" · ") || "Demand is public; revenue/ratings may be incomplete.";
}
var AGENT_ROLES = `Act as ALL of the following, and do not drop a role just because the slice looks small:
• Senior Product Manager
• Business Analyst
• UX/UI Strategist
• Software Architect
• Senior Full-Stack Engineer
• Database Architect
• Security Engineer
• Privacy & Compliance Researcher
• QA/Test Engineer
• DevOps/Cloud Architect
• App Store / Play Store / Web launch expert
• Technical Documentation Writer`;
var HARD_RULES = `HARD RULES
- Do NOT give a shallow generic answer. Implement working software.
- Do NOT invent laws, APIs, pricing, platform requirements, or SDK capabilities. If current store/policy text matters, look it up; otherwise mark ASSUMPTION vs FACT.
- Minimize personal data. Collect only what this slice needs.
- Treat security and privacy as requirements, not afterthoughts.
- Every screen this slice adds needs: loading, empty, error, success, and a denied-permission/offline path if relevant.
- No purple gradients, no emoji in UI chrome, no lorem, no placeholder buttons that do nothing.
- Do not break existing routes, auth, or billing when you add this slice.
- Include validation, error handling, and tests for the new code.
- Prefer simple, cheap MVP tech. Do not introduce Kafka, Kubernetes, or a second cloud.
- State the expected final result at the end of your work.`;
function constitution(input) {
	const { profile, betterName, who, positioning, stack, complaints, reviews } = input;
	return `${AGENT_ROLES}

I am building a real-world ${platformOf(profile)} named ${betterName}.
This is NOT a toy. Path: IDEA → MVP → PRODUCTION → LAUNCH.

PRODUCT IDEA
${betterName} — ${positioning}
Who it's for: ${who}
Wedge vs ${rivalName(profile)} (${profile.sourceLabel}: ${profile.sourceUrl}):
${profile.description.slice(0, 900)}

INCUMBENT / ASK
Name: ${profile.name}
Kind: ${profile.kind}
Category: ${profile.category ?? "unspecified"}
Developer: ${profile.developer ?? "unknown"}
Metrics: ${metrics(profile)}
Website/listing: ${profile.website ?? profile.sourceUrl}

COMPLAINTS THIS PRODUCT EXISTS TO KILL
${complaintList(complaints)}

PUBLIC TRACES (do not invent additional quotes)
${reviewList(reviews)}

STACK (do not silently swap it)
${stack.recommendation}
Why: ${stack.reason}
Pieces: ${stack.pieces.join(", ")}

${HARD_RULES}`;
}
function buildMasterBlueprint(input) {
	const { profile, betterName, who, positioning, whyNow, thesis, stack, complaints, gaps, mvpScope, outOfScope, launch, reviews } = input;
	const platform = platformOf(profile);
	const mobile = platform !== "WEB APP / SAAS";
	const c1 = complaints[0];
	return `${constitution({
		profile,
		betterName,
		who,
		positioning,
		stack,
		complaints,
		reviews
	})}

==================================================
1. UNDERSTAND THE PRODUCT
==================================================
Product: ${betterName}
Platform: ${platform}
Thesis: ${thesis}
Why now: ${whyNow}

Problem it solves: ${c1?.theme ?? "the category's first-run and trust failure"} — ${c1?.howToFix ?? launch.differentiator}
Target users: ${who}
Primary use case: complete one real job in under three minutes without a demo call.
Secondary use cases: pay, cancel, export, and see status without emailing support.
User pain points (sourced or inferred — labeled above).
Core value proposition: ${positioning}
Differentiation: ${launch.differentiator}
Assumptions: public traces may be incomplete; do not fabricate reviews. Pricing of ${profile.name} may have changed — verify before you scrape copy.
Risks: cloning a store app too closely (IP), scraping private data, dark-pattern billing, store rejection for incomplete account deletion.
Potential abuse: spam, scraped PII, card testing, generated-content spam. Design rate limits and abuse reports into MVP if UGC exists; otherwise defer.
Regulatory: FACT — I am not a lawyer. ASSUMPTION — this MVP is a general productivity/consumer tool, not medical, banking, or children's. If the category is health/finance/kids, STOP and flag it before collecting data.

==================================================
2. PRD
==================================================
Overview: ${betterName} is the ${profile.category ?? "category"} that treats “${(c1?.theme ?? "trust").toLowerCase()}” as the product.
Goals: ship a paid MVP a solo builder can demo in 1–2 weeks; make the top complaint structurally impossible.
Non-goals:
${outOfScope.map((x) => `- ${x}`).join("\n")}
MUST HAVE (MVP):
${mvpScope.map((x) => `- ${x}`).join("\n")}
SHOULD HAVE: ${gaps.slice(0, 3).join("; ") || "public changelog"}
COULD HAVE: native widgets, teams, marketplace, custom models.
NOT REQUIRED FOR MVP: ${outOfScope.join("; ")}
Success metrics: first-run completion < 3 min; checkout conversion; cancel-without-email; 1-star themes from ${profile.name} cannot be filed against ${betterName}.
Acceptance: a cold user reaches a saved result, sees a price, and can delete their account.

For every major feature you implement, document in-repo:
1. What it does  2. Why  3. User flow  4. Inputs  5. Outputs
6. Edge cases  7. Error states  8. Permissions  9. Data stored  10. Privacy impact

==================================================
3. COMPLETE USER FLOWS
==================================================
Map, then implement, these journeys. Each needs happy / empty / loading / error / offline.
- First launch / marketing → CTA “Start the first win”
- Onboarding (one question, then do the job for them)
- Auth (magic link or OAuth; no password theatre in MVP unless already present)
- Main workspace with sample data already loaded
- Core job that kills: ${c1?.theme ?? "the top complaint"}
- Billing: pricing page, estimator, Stripe Checkout, customer portal, cancel in two clicks
- Quota / usage chip in chrome
- Settings, privacy, terms, help, contact
- Account deletion + data deletion (store requirement if mobile)
- Logout
- Support (in-app form or emailed transcript)
Do NOT ship a flow whose only error state is a blank screen.

==================================================
4. SCREEN-BY-SCREEN SPEC
==================================================
Inventory at minimum:
Marketing home, Compare vs ${profile.name}, Pricing, Auth, Onboarding, Workspace home, Core job screen, Result/receipt, Billing/quota, Settings, Privacy, Terms, Help, Contact, Delete account, 404, Offline, Permission-denied, Checkout success, Checkout fail.
For EVERY screen specify in code comments or a short SCREEN.md: purpose, components, navigation, actions, validation, loading/empty/error/success, API, analytics event names, a11y (labels, contrast, 44px targets).

==================================================
5. UX/UI SYSTEM
==================================================
Design philosophy: editorial, dark, expensive, calm. One accent. No emoji in chrome.
Type: serif display + sans body, or a single family with real weight contrast.
Spacing: 4/8 scale. Concentric radii (outer = inner + padding).
Components: shadcn/Radix buttons, inputs, dialogs, sheets. No ad-hoc hex.
Motion: 150–250ms opacity/transform only; respect prefers-reduced-motion.
Empty/error states are first-class copy, not illustrations.
Mobile 390px must work; tap targets ≥ 44px; no horizontal overflow.

==================================================
6. TECH STACK
==================================================
Chosen: ${stack.recommendation}
Pieces: ${stack.pieces.join(", ")}
Why: ${stack.reason}
Compare before adding anything else (FACT vs recommendation):
- Web MVP: TanStack Start or Next.js App Router + Tailwind + Postgres + Stripe + Resend. Alternative: Rails. Do not add a second backend language.
- Mobile MVP: Expo + Expo Router + Postgres via API + Stripe or native IAP if the store requires it.
  FACT: if you sell digital goods inside an iOS/Android app, Apple/Google in-app purchase rules may apply. Web SaaS billed on the web is different. Do not guess — check current StoreKit / Play Billing policy before charging in-app.
- Auth: magic link or one OAuth provider. Store hashes/tokens server-side. Never put secrets in VITE_/EXPO_PUBLIC_ vars.
- Files: S3-compatible only if the core job needs uploads; otherwise skip.
- Hosting: one region, one database, one app. Vercel/Fly/Cloudflare. No multi-region MVP.
Prefer free tiers. State lock-in and cost before adding a vendor.

==================================================
7. SYSTEM ARCHITECTURE
==================================================
Client → HTTPS API/server functions → Auth middleware → Business logic → Postgres.
External: Stripe (payments), Resend (email), optional object storage.
Background: none in MVP unless email/webhooks require a queue; then a single job table.
No microservices.
Data flow: user action → validate → authorize → mutate → receipt in UI.

==================================================
8. DATABASE
==================================================
Minimum tables (adapt names to the domain, do not add souvenirs):
- users (id, email, created_at, deleted_at)
- sessions or magic_link_tokens
- workspaces / projects (user_id, name, created_at)
- the CORE OBJECT of this product (status, timestamps, cost/usage if relevant)
- billing_customers (user_id, stripe_customer_id, plan, status)
- events_audit (optional, no PII beyond user_id)
COLLECT THE MINIMUM. No birthdays, no phone, no contacts upload unless the core job is impossible without it.
Indexes on foreign keys and email unique.
Soft-delete users; hard-delete PII on account deletion within 30 days (ASSUMPTION — confirm with counsel).
Migrations checked into repo.

==================================================
9. API DESIGN
==================================================
For each endpoint you add: method, path, auth, request, response, validation, errors (400/401/403/404/409/429), rate limit, example.
Version in path or accept header later — MVP can be unversioned but consistent.
Pagination for lists. Idempotency keys on Stripe and other creates.
Never trust a client-sent user id.

==================================================
10. SECURITY
==================================================
Threat model (MVP):
RISK account takeover → IMPACT billed victim → MITIGATION magic links expire, no session fixation, rate-limit login.
RISK IDOR on workspace objects → IMPACT data leak → MITIGATION every query scoped by verified user id.
RISK card testing → IMPACT Stripe storm → MITIGATION Stripe Radar + rate limit checkout.
RISK XSS/injection → IMPACT session theft → MITIGATION parameterized queries, escape HTML, CSP later.
RISK secret leak in client bundle → IMPACT full compromise → MITIGATION server-only keys.
Passwords: if you must, use a slow hash (argon2id/bcrypt); prefer magic link.
HTTPS only. No debug dumps in production.

==================================================
11. PRIVACY
==================================================
Data inventory (fill as you implement): DATA → PURPOSE → WHERE → WHO → RETENTION → DELETION
Likely: email (auth, billing), usage events (quota), payment tokens via Stripe (we never store PAN).
Applicability: do NOT assume GDPR/CCPA/DPDP applies without knowing user geography. Design so you CAN delete and export; put a lawyer on the final policy.
Children: do not target under-13. Age-gate if the category is social.
AI: if you call an LLM, disclose it, do not train on customer content by default, and keep prompts off logs.

==================================================
12. LEGAL DOCUMENTS
==================================================
Needed for launch (lawyer must review — this is not legal advice):
- Privacy Policy (needed)
- Terms of Service (needed)
- Refund/cancellation (needed if you charge)
- Cookie notice (needed if you use non-essential cookies on web)
- Store disclosures / Data Safety form (needed if mobile)
Show links in footer, signup, and checkout. Do not paste generic policies as if they were law.

==================================================
13. COOKIES & TRACKING
==================================================
MVP: essential session cookie only. No ad pixels. If analytics exists, it must be privacy-gated and documented.
Mobile: no advertising ID until you actually show ads.

==================================================
14. THIRD PARTIES
==================================================
Inventory every SDK: service, purpose, data shared, region, cost, free tier, alternative.
Default allowed: ${stack.pieces.join(", ")}, Stripe, Resend.
Adding another vendor requires a one-paragraph privacy note in README.

==================================================
15. PAYMENTS
==================================================
${launch.pricing}
Flow: public /pricing → estimator → Stripe Checkout → webhook → entitlement in DB → quota chip.
Cancel: two clicks, no email, no retention maze.
Refunds: 7 days if they did not complete the first job — state it on pricing.
FACT: in-app digital goods on iOS/Android often must use Apple/Google billing. Web SaaS can use Stripe. Do not mix casually.
PCI: never touch raw cards; Stripe Checkout / Payment Element only.

==================================================
16. STORE REQUIREMENTS (if ${mobile ? "mobile" : "you later wrap a webview"})
==================================================
If shipping App Store / Play:
- Privacy Nutrition / Data Safety filled honestly
- Account deletion in-app
- Permissions only when the feature is used
- No placeholder store listing
Check CURRENT Apple App Review Guidelines and Google Play policy — they change. Do not rely on memory.

==================================================
17. WEB REQUIREMENTS
==================================================
HTTPS, security headers (start with frame-ancestors, referrer-policy, nosniff), real 404, favicon, OG title/description, no Disallow: / on the marketing site, accessible forms, Core Web Vitals not wrecked by 4MB hero videos.

==================================================
18. ANALYTICS
==================================================
Events only if they change a decision:
first_win_completed, checkout_started, checkout_succeeded, cancel_clicked, account_deleted.
No raw PII in event props. No session replay in MVP.

==================================================
19. TESTING
==================================================
For this product, tests must cover:
- Happy first-run
- Invalid input
- Auth fail
- IDOR attempt (user B cannot read user A's object)
- Stripe webhook replay
- Cancel + quota zero
- Account deletion removes PII
Add a smoke path a human can click in 3 minutes.

==================================================
20. PERFORMANCE & SCALE
==================================================
Design for 100 users. Mention what breaks at 10k (DB, email, LLM cost) in README. Do not install Redis until you measure.

==================================================
21. COST
==================================================
MVP should run on free/low tiers: hosting, one Postgres, Stripe fees, email. Call out usage-based LLM cost BEFORE you put a generate button on the homepage.

==================================================
22. DEVELOPMENT PHASES
==================================================
Phase 0 research (done — complaints above)
Phase 1 repo + design tokens
Phase 2 marketing home
Phase 3 auth + sample workspace
Phase 4 core loop that kills “${c1?.theme ?? "the complaint"}”
Phase 5 onboarding
Phase 6 billing
Phase 7 differentiator + compare + changelog
Phase 8 tests + privacy pages
Phase 9 deploy
Each phase is a separate agent prompt (the step-by-step pack). Do not generate the entire app in one shot.

==================================================
23. THIS PROMPT'S JOB
==================================================
Paste this master blueprint FIRST so the agent has the constitution.
Then paste the numbered implementation prompts IN ORDER. Finish a step before the next.
Each implementation prompt is self-contained but must obey this blueprint.

==================================================
24–25. DEPLOY + LAUNCH CHECKLIST
==================================================
[ ] Auth works on a cold device
[ ] First win < 3 minutes
[ ] Pricing public, cancel works
[ ] Account + data deletion
[ ] Privacy + terms linked
[ ] Stripe webhooks verified
[ ] No secrets in the client
[ ] Error states are copy, not crashes
[ ] Store/privacy forms (if mobile)
[ ] Backup + restore tested once
[ ] Support path exists

==================================================
26. WHAT WE MIGHT FORGET
==================================================
Top things this clone will forget if you are sloppy:
1. Account deletion  2. Cancel  3. Empty states  4. IDOR  5. Webhook retries
6. Quota chip  7. Honest ads/paywall  8. Rate limits  9. Lawyer-reviewed policy
10. Accessibility labels  11. 390px layout  12. Seed data  13. Compare page
14. Logging secrets  15. LLM cost  16. Timezones  17. Failed payments
18. Support inbox  19. Changelog  20. “What happens when Stripe is down”

==================================================
27. FINAL INSTRUCTION
==================================================
Do not describe the product. Build the current slice as working software that obeys this blueprint.
Expected result: runnable code, tests, and a short note of assumptions you had to make.
First users: ${launch.firstUsers}`;
}
function slicePrompt(constitutionText, spec) {
	return `${constitutionText}

==================================================
THIS SLICE ONLY — ${spec.phase}
==================================================
Title: ${spec.title}
Goal: ${spec.goal}

You are not generating the entire application. You are implementing THIS slice on top of whatever already exists. Do not rewrite unrelated files. Do not break prior slices.

1. PRODUCT / WHY
${spec.goal}

2. FILES / COMPONENTS TO CREATE OR MODIFY
${spec.files}
If a file already exists, modify it. Do not duplicate.

3. FUNCTIONAL REQUIREMENTS (MUST)
${spec.requirements}

4. USER FLOW (step-by-step)
${spec.flow}

5. SCREENS
${spec.screens}
Each screen: purpose, primary action, loading, empty, error, success, a11y label.

6. VALIDATION, ERRORS, EDGE CASES
${spec.validation}

7. DATA
Only persist what this slice needs. Name the tables/fields. No souvenir columns.

8. SECURITY / PRIVACY
${spec.security}

9. TESTS
${spec.tests}

10. EXPLICITLY OUT OF SCOPE FOR THIS SLICE
Anything not listed above. No extra vendors. No redesign of the whole app.

DEFINITION OF DONE
${spec.done}

EXPECTED FINAL RESULT
Working UI + state (not a wireframe). I can click through the flow without a console error. You list files changed and any ASSUMPTIONS.`;
}
function buildVibeGuide(input) {
	const { profile, betterName, who, positioning, stack, complaints, reviews } = input;
	const c1 = complaints[0];
	const c2 = complaints[1];
	const c3 = complaints[2];
	const rival = rivalName(profile);
	const site = profile.website ?? profile.sourceUrl;
	const mobile = profile.kind === "appstore" || profile.kind === "playstore";
	const core = constitution({
		profile,
		betterName,
		who,
		positioning,
		stack,
		complaints,
		reviews
	});
	const slug = hitKey(profile.kind, profile.id);
	return [
		{
			title: mobile ? `Marketing site that names the wedge against ${profile.name}` : `Kill ${profile.name}'s first impression`,
			why: `${betterName} only exists if a stranger understands the difference in one screen.`,
			doneWhen: "A stranger can explain the difference from the hero without scrolling, on a 390px screen and a desktop screen, with no console errors.",
			prompt: slicePrompt(core, {
				title: `Marketing homepage for ${betterName}`,
				phase: "PHASE 2 — UI / marketing",
				goal: `Ship a real marketing homepage for ${betterName} that beats ${rival} (${site}) by fixing “${c1?.theme ?? "the obvious pain"}”.`,
				files: `Create/modify:
- src/routes/index.tsx (or app/page.tsx / Expo app/(marketing))
- src/styles.css tokens if missing
- src/components/marketing/* (hero, complaint-fix pairs, pricing teaser, footer)
Do not add auth yet.`,
				requirements: `- Dark, editorial, premium. No purple, no emoji, no gradient blobs.
- Hero: one-sentence promise for ${who}. Primary CTA “Start the first win”.
- Three complaint → fix pairs using these themes: ${complaints.slice(0, 3).map((c) => c.theme).join("; ")}.
- Pricing teaser (not fake $0 forever). Footer links: Privacy, Terms (can be stub pages with honest “draft — lawyer review”).
- Compare teaser linking to /compare.
- Real copy about ${profile.name}, not lorem. Quote sourced complaints; paraphrase inferred ones and label them.`,
				flow: `1. Land. 2. Read promise. 3. Scan three pains. 4. Click Start the first win (can go to /app or /login stub). 5. Optional: open /compare.`,
				screens: `Home (this slice). Footer legal stubs. 404 if you touch the router.`,
				validation: `No dead buttons. Images have alt. Contrast AA. If a font fails, system stack still looks intentional.`,
				security: `No analytics pixels. No inline third-party scripts. External links rel="noreferrer".`,
				tests: `A browser smoke or component test that the hero, CTA, and three complaint headings render.`,
				done: `Homepage is the product story. 390px has no horizontal scroll. CTA is ≥ 44px.`
			})
		},
		{
			title: "Scaffold the app with the core object already on screen",
			why: "Most clones die in empty dashboards. The first logged-in view must already contain sample work.",
			doneWhen: "A fresh account (or demo user) shows useful sample data and one obvious next click.",
			prompt: slicePrompt(core, {
				title: `Workspace scaffold for ${betterName}`,
				phase: "PHASE 3–5 — app shell, auth stub, data",
				goal: `Scaffold the logged-in product so the first screen is a workspace for ${betterName}, already filled with realistic sample data related to: ${profile.description.slice(0, 400)}`,
				files: mobile ? `Expo Router app group (app)/(app), seed.ts, auth stub, workspace screen, top bar.` : `TanStack Start or Next app router: /app workspace route, seed module, layout with top bar, server function to load sample data.`,
				requirements: `- Magic-link or demo “Continue” is fine; do not build a custom IdP.
- After enter, land on a workspace that ALREADY has sample records. Empty-state copy exists but is not the default.
- Top bar: ${betterName}, one primary action that starts the job ${profile.name} makes people wait for, a usage/status chip.
- Visual language matches the marketing page.
- Types for the core object. Seed file is the source of truth until Stripe exists.`,
				flow: `1. From marketing CTA. 2. Auth stub. 3. Workspace with sample data. 4. Click the single primary action.`,
				screens: `Auth stub, Workspace home (sample data), Settings stub.`,
				validation: `If seed fails, show an error with retry, not a white page. If unauthenticated, redirect with return URL.`,
				security: `Do not put service keys in the client. Demo user cannot see another user's data even in local seed (namespace by user id).`,
				tests: `Unit test the seed shape. Route test: unauthenticated redirect. Render test: sample rows visible.`,
				done: `I can enter the app and see work, not an empty illustration.`
			})
		},
		{
			title: `Make “${c1?.theme ?? "the top complaint"}” structurally impossible`,
			why: c1?.howToFix ?? "The clone only works if the #1 complaint cannot be filed.",
			doneWhen: "You can demo the old 1-star and show the screen that prevents it.",
			prompt: slicePrompt(core, {
				title: `Core loop of ${betterName}`,
				phase: "PHASE 6 — core feature",
				goal: `Implement the core loop so this complaint cannot happen:\n“${c1?.quote ?? "the product is unclear and expensive"}”\nProduct rule: ${c1?.howToFix ?? "surface cost, status, and next action on the primary screen"}.`,
				files: `Domain module for the core object, the primary screen, server functions/API, tests. Do not add billing or onboarding in this slice except as display of status/cost.`,
				requirements: `- This IS the MVP. No unrelated features.
- Visible assertions in the UI: receipts, timestamps, status, cost, or verification — whichever makes the complaint impossible.
- Every core object has created_at, updated_at, and a user-visible state.
- Error and partial-success paths (timeout, provider fail, invalid input).`,
				flow: `1. From workspace primary action. 2. Provide the minimum input. 3. See progress. 4. Get a result that would have been the 1-star on ${profile.name}. 5. Save.`,
				screens: `Core job screen, in-progress, result/receipt, failure with next step.`,
				validation: `Invalid input inline. Double-submit locked. If an external API fails, show a human sentence and retry.`,
				security: `Authorize every read/write by verified user. Rate-limit the expensive action. Do not log secrets or raw user content to a third party without disclosure.`,
				tests: `Happy path, invalid input, unauthorized access, provider failure. If money/usage is involved, assert the receipt matches the action.`,
				done: `A screen recording could contrast ${profile.name}'s complaint with this UI.`
			})
		},
		{
			title: "Three-minute onboarding that does the first job for them",
			why: "Reviews cluster on confusion. Do the work in front of the user once.",
			doneWhen: "A cold user reaches a saved result in under three minutes without docs.",
			prompt: slicePrompt(core, {
				title: `Onboarding for ${betterName}`,
				phase: "PHASE 6b — first-run",
				goal: `A skippable onboarding that still produces a real artifact. Copy may mention how ${rival} makes this harder — do not be cruel, be specific.`,
				files: `Onboarding route/wizard, persistence of progress, hook from first login, skip control.`,
				requirements: `1. One question about their goal (not a 12-step persona quiz).
2. Auto-generate or prefill the first artifact using sample or imported data.
3. Highlight the result and ask them to tweak, not to configure.
4. Persist progress. Back/skip. Default path produces a saved output.
5. If they skip, workspace still has sample data from the previous slice.`,
				flow: `1. First authenticated session. 2. One question. 3. Watch the job run. 4. Land on the result. 5. Optional tweak. 6. Enter the normal workspace.`,
				screens: `Question, generating (honest ETA), result, skip confirm.`,
				validation: `If generation fails, keep the answer, offer retry, do not dump them into an empty app without explanation.`,
				security: `Onboarding answers are user-scoped. Do not send them to an LLM vendor with PII if a local template will do for MVP.`,
				tests: `First-run completes with a saved object. Skip path works. Refresh mid-onboarding restores step.`,
				done: `Stopwatch test: cold user → saved result < 3 minutes.`
			})
		},
		{
			title: "Honest billing with an estimator",
			why: c2?.howToFix && /pric|bill|ads|paywall/i.test(c2.theme) ? c2.howToFix : "Indie 1-stars are usually billing surprises.",
			doneWhen: "You can subscribe, see quota, and cancel without emailing anyone.",
			prompt: slicePrompt(core, {
				title: `Stripe billing for ${betterName}`,
				phase: "PHASE 6c — payments",
				goal: `Public pricing, useful free tier, estimator, Stripe Checkout, webhook entitlements, cancel in two clicks, quota chip in chrome.
Known incumbent pricing signal: ${profile.insights["Pricing model"] || profile.price || "unknown — do not invent a fake competitor price; say unknown"}.`,
				files: `/pricing page, estimator component, Stripe server functions, webhook route, billing table migration, customer portal or cancel action, quota chip in the app shell.`,
				requirements: `- Useful free tier that completes one real job.
- Estimator inputs match how this category actually burns money (seats, runs, words, etc.).
- No annual-only dark pattern. No confirm-shaming.
- Webhook signature verified. Idempotent.
- Quota visible before the user hits a wall.
- Failed payment state with a retry link.
FACT: If this is a store app selling digital goods, check Apple/Google IAP rules BEFORE you wire Stripe into the mobile client. Web billing on a website is the default for this MVP unless you have already decided to ship IAP.`,
				flow: `1. /pricing. 2. Play with estimator. 3. Checkout. 4. Return URL. 5. Entitlement on. 6. Quota chip updates. 7. Settings → cancel → confirm → free tier.`,
				screens: `Pricing, Checkout (Stripe hosted/element), Success, Billing settings, Cancel confirm, Payment failed.`,
				validation: `Webhook retries, duplicate events, user without customer id, cancel of already-canceled, free-tier cap.`,
				security: `Never store PAN. Secrets server-only. Authorize billing ops by user id. Rate-limit checkout session creation.`,
				tests: `Webhook fixture: checkout.session.completed grants plan. Cancel removes it. Estimator math unit tests. Unauthorized user cannot open another user's portal.`,
				done: `Subscribe, see quota, cancel, no email required.`
			})
		},
		{
			title: `Ship the white space: ${c3?.theme ?? "trust on the home screen"}`,
			why: c3?.howToFix ?? "Pick one gap the incumbent left open and make it default-on.",
			doneWhen: "The differentiator is on the home screen of a logged-in user.",
			prompt: slicePrompt(core, {
				title: `Differentiator for ${betterName}`,
				phase: "PHASE 7 — wedge feature",
				goal: `Add this as default-on, not a settings excavation:\n${c3?.howToFix ?? "a public changelog, in-app support inbox, and last-verified / last-run timestamps on every object"}.`,
				files: `Home-screen component, any new table, empty+error states, copy.`,
				requirements: `- Visible on workspace home without hunting.
- Plain language. Timestamps in the user's locale.
- Empty and error states written, not blank.
- If this is support: 1-business-day SLA copy, even if the backend is email.`,
				flow: `Logged-in user opens the app and sees the differentiator immediately.`,
				screens: `Workspace home (modified), detail of one object showing the new field, empty/error.`,
				validation: `Missing timestamps show “not yet”, never “undefined”. Support form validates email + body.`,
				security: `Support messages are user-scoped. Do not put other customers' tickets on this screen.`,
				tests: `Home renders the differentiator with seed data. Empty state snapshot or assertion.`,
				done: `The wedge is obvious in a first screenshot of the logged-in app.`
			})
		},
		{
			title: "Launch kit: compare, changelog, legal stubs, first 20 users",
			why: profile.kind === "reddit" ? "The thread is already the distribution. Reply with a working product, not a waitlist." : `${profile.name} already has demand. You win with a sharper story, not a broader product.`,
			doneWhen: "Comparison page, changelog, legal stubs, and a launch post draft all exist in the repo.",
			prompt: slicePrompt(core, {
				title: `Launch surfaces for ${betterName}`,
				phase: "PHASE 8–10 — launch",
				goal: `Ship /compare/${profile.kind === "reddit" ? "ask" : slug}, /changelog, privacy, terms, and a launch post draft. Waitlist stores email locally AND via a server function.`,
				files: `src/routes/compare, changelog, privacy, terms, waitlist server fn, content/launch-post.md (PH + X thread + Reddit reply).`,
				requirements: `- Compare table of the complaints we are killing vs ${profile.name}. Sourced quotes attributed; inferred labeled.
- Changelog with dates, not “coming soon”.
- Privacy/terms: honest stubs that list what you actually collect. Mark “not legal advice — have a lawyer review”.
- Launch post: sharp, not mean. Include the first-win screenshot prompt.
- Waitlist: email validation, no extra fields.
First users plan: ${profile.kind === "reddit" ? `reply in ${profile.sourceUrl}` : `go where ${profile.name} is discussed (${profile.sourceLabel})`}.`,
				flow: `Marketing → compare → waitlist or start. Footer → privacy/terms. /changelog from footer and from the in-app chip.`,
				screens: `Compare, Changelog, Privacy, Terms, Waitlist success.`,
				validation: `Invalid email. Duplicate waitlist. Compare page usable on 390px.`,
				security: `Waitlist emails are not public. Rate-limit the POST. No open redirects.`,
				tests: `Compare renders all complaint themes. Waitlist rejects bad email.`,
				done: `I can copy the launch post and send someone /compare without shame.`
			})
		}
	].map((s, i) => ({
		...s,
		step: i + 1
	}));
}
function attachDetailedPrompts(brief, profile, reviews) {
	const vibeGuide = buildVibeGuide({
		profile,
		betterName: brief.opportunity.betterName,
		who: brief.opportunity.whoItsFor,
		positioning: brief.opportunity.positioning,
		stack: brief.stack,
		complaints: brief.complaints,
		reviews
	});
	const masterBlueprint = buildMasterBlueprint({
		profile,
		betterName: brief.opportunity.betterName,
		who: brief.opportunity.whoItsFor,
		positioning: brief.opportunity.positioning,
		whyNow: brief.opportunity.whyNow,
		thesis: brief.thesis,
		stack: brief.stack,
		complaints: brief.complaints,
		gaps: brief.gaps,
		mvpScope: brief.mvpScope,
		outOfScope: brief.outOfScope,
		launch: brief.launch,
		reviews
	});
	return {
		...brief,
		vibeGuide,
		masterBlueprint
	};
}
function firstMarket(profile) {
	return (profile.category || profile.insights.Markets || deskMarket(profile)).split(",")[0].replace(/\[|\]/g, "").trim();
}
function deskMarket(profile) {
	if (profile.kind === "reddit" || profile.kind === "twitter") return "the thing people are asking for";
	if (profile.kind === "hackernews") return "the HN story";
	if (profile.kind === "appstore") return "iOS app";
	if (profile.kind === "playstore") return "Android app";
	if (profile.kind === "firefox") return "browser add-on";
	if (profile.kind === "github") return "developer tool";
	if (profile.kind === "producthunt" || profile.kind === "betalist" || profile.kind === "launchingnext") return "new launch";
	return "SaaS";
}
function blob(profile, websiteText = null) {
	return [
		profile.name,
		profile.description,
		profile.category,
		profile.kind,
		Object.values(profile.insights).join(" "),
		Object.values(profile.techStack).flat().join(" "),
		Object.values(profile.extra).join(" "),
		websiteText ?? ""
	].join(" ").toLowerCase();
}
function isAskKind(kind) {
	return kind === "reddit" || kind === "twitter" || kind === "hackernews" || kind === "lobsters";
}
function pickName(profile) {
	if (isAskKind(profile.kind) || profile.kind === "devto") {
		const t = profile.name.replace(/\.$/, "");
		const named = t.match(/\b(?:called|named|build|make)\s+([A-Z][A-Za-z0-9]+)\b/);
		if (named?.[1] && named[1].length > 3) return named[1];
		const words = t.replace(/^(somebody make( this)?:?|someone make|i wish there was|looking for)\s+/i, "").replace(/\s+/g, " ").trim().split(" ").slice(0, 3).join(" ");
		if (words.length >= 4 && words.length <= 28) return words.replace(/[^A-Za-z0-9 ]/g, "").trim() || "Northlane";
		return "Northlane";
	}
	const b = blob(profile);
	const market = firstMarket(profile).toLowerCase();
	if (/faceless|youtube|tiktok|reel/.test(b) && /video|content|voiceover/.test(b)) return "Cutline";
	if (/seo|article|blog|writer/.test(b) && /content|copy/.test(b)) return "Draftwell";
	if (/video|avatar|clip/.test(b) && /render|reel|ugc/.test(b)) return "Cutline";
	if (/course|learn|tutor|lesson/.test(b)) return "Lessonbar";
	if (/\b(directory|lead gen|prospect|outreach|google maps)\b/.test(b)) return "Rolodeck";
	if (/linkedin|schedule content/.test(b)) return "Pulseboard";
	if (/widget|embed|extension/.test(b)) return "Pinframe";
	if (/roommate|dating|match/.test(b)) return "Hearth";
	if (/trade|stock|crypto|token/.test(b) && /chart|setup/.test(b)) return "Ledgerly";
	if (/analyt|metric|dashboard/.test(b)) return "Clearmeter";
	if (/convert|currency|calculator/.test(b)) return "Fold";
	if (/email|newsletter|digest/.test(b)) return "Firstfold";
	if (/claim|invoice|legal|insurance/.test(b)) return "Filepath";
	if (/\b(api gateway|model router|llm gateway)\b/.test(b)) return "Onepipe";
	if (/photo|editor|filter|collage/.test(b)) return "Grainline";
	if (/fitness|habit|health|workout/.test(b)) return "Setcount";
	if (/finance|budget|bank|spend/.test(b)) return "Ledgerly";
	if (/chat|message|social/.test(b)) return "Quietline";
	if (/market|saas/.test(market)) return "Northlane";
	return `${(profile.name.replace(/\s*(AI|App|HQ|Labs|IO|Inc|:.*)\s*$/i, "").trim() || profile.name).split(/\s+/).slice(0, 2).join(" ")} Clear`.slice(0, 28);
}
function websitePlays(profile, websiteText) {
	if (!websiteText) return [];
	const t = websiteText.toLowerCase();
	const name = profile.name;
	const plays = [];
	if (/book a demo|request a demo|talk to sales|contact sales|get a demo/.test(t)) plays.push({
		theme: "Demo-gated self-serve",
		severity: "critical",
		quote: `${name}'s site pushes a demo instead of a first win. People who already pay in this category will not book a calendar slot to find out if it works.`,
		howToFix: "Ship a useful free path: sample workspace, one job completed, then a paywall. Demo can exist for enterprise — it cannot be the only door.",
		gap: "Self-serve first win instead of a sales call."
	});
	if (/waitlist|coming soon|join the wait|get early access/.test(t)) plays.push({
		theme: "Waitlist instead of a product",
		severity: "high",
		quote: `${name} still smells like a landing page. A waitlist in a category that already converts is an invitation to be replaced.`,
		howToFix: "Take the card today. Paid plan live on day one, even if the backend is a spreadsheet for week one.",
		gap: "Pay-today instead of a waitlist."
	});
	if (/contact (us )?for pricing|custom pricing|enterprise pricing|request a quote/.test(t)) plays.push({
		theme: "Pricing you have to beg for",
		severity: "critical",
		quote: `${name} hides the number. That reads as expensive, and indie buyers bounce before they ever feel the product.`,
		howToFix: "A public /pricing page with a useful free tier, a monthly they can explain out loud, and a cancel that works in two clicks.",
		gap: "A price you can screenshot."
	});
	if (/no refund|non-refundable|all sales final/.test(t)) plays.push({
		theme: "Refund hostility",
		severity: "high",
		quote: `${name} copy signals you will not get your money back. That is how 1-stars get written even when the product is fine.`,
		howToFix: "7-day refund if they did not complete the first job. Put it on the pricing page, not in a PDF.",
		gap: "A refund window tied to first value, not fine print."
	});
	return plays;
}
function playbook(profile, websiteText) {
	const b = blob(profile, websiteText);
	const name = profile.name;
	const plays = websitePlays(profile, websiteText);
	const add = (p) => {
		if (plays.some((x) => x.theme === p.theme)) return;
		plays.push(p);
	};
	if (isAskKind(profile.kind)) {
		add({
			theme: "Nobody shipped the obvious version",
			severity: "critical",
			quote: `${profile.sourceLabel} is already describing the product. The thread is the spec — incumbents left this on the floor.`,
			howToFix: "Treat the post as acceptance tests. The MVP is the shortest path that makes this exact request feel finished.",
			gap: "A product that matches the ask, not a broader platform."
		});
		if (/price|cheap|free|afford|subscription/i.test(b)) add({
			theme: "Existing tools price out the asker",
			severity: "high",
			quote: "The thread keeps circling cost. A useful free tier that completes one job will take this room.",
			howToFix: "Ship a free first-win, then a simple monthly. No demo call.",
			gap: "A price a Reddit thread would actually pay."
		});
	}
	if (profile.kind === "appstore" || profile.kind === "playstore") {
		add({
			theme: "Store 1-stars cluster on the same three things",
			severity: "critical",
			quote: `${name} is charting, which means demand is real. The 1-stars are a punch list: ads, crashes, account traps, paywalls that lie.`,
			howToFix: "Read the last fifty 1-stars as a backlog. Pick the two themes with the most blood and make them structurally impossible in the clone.",
			gap: "A charting category with a cleaner first week."
		});
		if (/ad|paywall|premium|subscription/.test(b)) add({
			theme: "Ads and a hostile paywall",
			severity: "high",
			quote: `Store reviews punish ${name} when the free path is unusable and cancel is a maze.`,
			howToFix: "One honest free job, then a single monthly. Cancel in two taps. Ads never interrupt the core loop.",
			gap: "A free path that still feels like the product."
		});
	}
	if (/lead gen|prospect|outreach|scrape|google maps/.test(b) || /\bb2b\b/.test(b) && /lead|prospect/.test(b)) {
		add({
			theme: "Stale leads and junk rows",
			severity: "critical",
			quote: `Lead tools like ${name} die when the first 20 rows bounce. Buyers do not forgive a CSV of closed shops and generic emails.`,
			howToFix: "Every row gets last-verified, a bounce webhook, and a 'why this lead' snippet. Reject empty emails before the user exports.",
			gap: "Verified, explainable leads — not a scrape dump."
		});
		add({
			theme: "Outreach that burns the domain",
			severity: "high",
			quote: `${name} users will torch their sending domain if the product hands them a spray-and-pray sequence with no warmup or personalization.`,
			howToFix: "Default to 15 highly personalized emails, not 500. Show spam-risk before send. Connect to an existing mailbox rather than a mystery SMTP.",
			gap: "Safe, small-batch outreach as the default."
		});
	}
	if (/linkedin|schedule content/.test(b)) add({
		theme: "Vanity engagement, no pipeline",
		severity: "high",
		quote: `Social tools like ${name} get cancelled when likes do not become conversations or customers.`,
		howToFix: "Make the home screen replies, DMs, and 'people who engaged twice' — not a calendar of posts. Queue is secondary to inbox.",
		gap: "An engagement inbox that is the product."
	});
	if (/faceless|youtube|tiktok|content production|reel|ugc/.test(b)) add({
		theme: "Volume without a voice",
		severity: "critical",
		quote: `Buyers of ${name} are scared the output is interchangeable sludge that platforms bury and clients reject.`,
		howToFix: "Force a brand kit (voice, banned phrases, 3 reference links) before generate. Show a 'why this script' trace. One revision included.",
		gap: "Brand-locked drafts with a visible edit pass."
	});
	if (/\b(llm gateway|api gateway|model router|openai proxy)\b/.test(b) || /ai[- ]?(agent|gateway|wrapper)(?!s)/.test(b)) {
		add({
			theme: "Usage and cost opacity",
			severity: "critical",
			quote: `People buying ${name} cannot see, in one screen, which model ate the budget. API gateways that hide unit economics get churned the week a bill spikes.`,
			howToFix: "Make a live usage ledger the home screen: tokens, cost, model, latency per request, with hard caps and Slack/email alerts before the card is charged.",
			gap: "A billing cockpit that is the product, not a settings afterthought."
		});
		add({
			theme: "Model lag and silent fallbacks",
			severity: "high",
			quote: `If ${name} routes to a stale model or fails over without saying so, developers ship the wrong quality bar and blame the wrapper.`,
			howToFix: "Expose the resolved model, region, and fallback chain on every response header and in the dashboard. Let the user pin versions.",
			gap: "Pinned model versions with visible fallback policy."
		});
	}
	if (/seo|article|writer|blog/.test(b) && !/faceless|youtube|tiktok|reel/.test(b)) add({
		theme: "Generic AI copy that tanks rankings",
		severity: "critical",
		quote: `Buyers of ${name} are scared the output is indistinguishable sludge that Google or clients will reject.`,
		howToFix: "Force source-backed drafts: outline from crawled URLs, quote extraction, and a 'human edit' pass with change-tracking before publish.",
		gap: "Citation-backed drafts instead of raw autocomplete."
	});
	if (/video|reel|avatar/.test(b)) add({
		theme: "Render queue and quality drift",
		severity: "high",
		quote: `${name} will lose users the first time a reel comes back late, watermarked, or with mismatched lipsync.`,
		howToFix: "Show a honest queue with ETA, allow 1 free rerender, and preview the first 3 seconds before burning credits.",
		gap: "Transparent queue + first-seconds preview before spend."
	});
	if (/course|learn|tutor/.test(b)) add({
		theme: "Stale curriculum, no proof of outcome",
		severity: "high",
		quote: `Courses like ${name} die when the stack they teach has moved on and there is no project a student can show.`,
		howToFix: "Ship a living syllabus with dated modules and a capstone the student publishes. Refund window tied to finishing lesson 1, not fine print.",
		gap: "Dated modules plus a public capstone."
	});
	if (/\b(directory|directories|affiliate list|lead list)\b/.test(b)) add({
		theme: "Stale records and thin coverage",
		severity: "critical",
		quote: `A directory is only as good as last-verified dates. ${name} buyers bounce when they hit dead emails or missing niches.`,
		howToFix: "Every row gets a last-verified stamp, bounce webhook, and 'request a niche' that actually emails the founder.",
		gap: "Verification dates on every record, not a static CSV."
	});
	if (/widget|embed|extension/.test(b)) add({
		theme: "Install friction and permission fear",
		severity: "high",
		quote: `Embeds and extensions lose the tab if install takes more than one paste or asks for spooky permissions.`,
		howToFix: "One script tag, visible sandbox, and a live playground on the marketing site that uses the same snippet.",
		gap: "Copy-paste install with a live playground."
	});
	if (/\b(roommate|roommates)\b/.test(blob(profile)) || /\b(dating app|dating marketplace)\b/.test(blob(profile))) add({
		theme: "Trust and empty-city cold start",
		severity: "critical",
		quote: `Marketplaces like ${name} feel dead in any city without density, and people will not pay to talk to ghosts.`,
		howToFix: "Launch city-by-city with a concierge matching the first 50 users by hand, then open self-serve. Verified photos and a report flow from day one.",
		gap: "Concierge density before self-serve fees."
	});
	add({
		theme: "Onboarding that assumes too much",
		severity: "high",
		quote: `Most ${name} signups will not read the docs. If the first session is not a win in under three minutes, they churn and write the 1-star.`,
		howToFix: "A single happy-path checklist: sample data already loaded, one obvious primary button, and a 90-second empty-state tour that does the first job for them.",
		gap: "A three-minute first win with sample data."
	});
	add({
		theme: "Pricing that feels like a trap",
		severity: "high",
		quote: `${name} will get roasted if plans hide limits, annual-only discounts, or usage that is impossible to forecast.`,
		howToFix: "Publish a public pricing page with a usage estimator, a visible free tier that is actually useful, and no dark patterns on cancel.",
		gap: "Honest estimator and a useful free tier."
	});
	add({
		theme: "Support disappears after the charge",
		severity: "medium",
		quote: `Indie tools get 1-stars for silence. If ${name} is a solo shop, buyers assume they will be stranded.`,
		howToFix: "In-app inbox with a 1-business-day SLA, a public changelog, and a status page. Even a Linear-backed form beats a hidden email.",
		gap: "In-app support with a public changelog."
	});
	if (profile.onSale) add({
		theme: "For-sale stigma",
		severity: "critical",
		quote: `${name} is listed for sale. Buyers read that as 'the founder is leaving' and will not build a workflow on it.`,
		howToFix: "Your rival should be operator-owned: say who ships, show a 30-day commit log, and offer an escrowed annual plan.",
		gap: "Visible operator + commit log as trust."
	});
	if (profile.github && profile.github.connected && profile.github.contrib30 <= 1) add({
		theme: "Quiet repo, quiet product",
		severity: "medium",
		quote: `${name} shows almost no shipping in the last 30 days. Developers treat that as abandonware even when revenue is fine.`,
		howToFix: "A public changelog fed by real merges, and a weekly shipping note on the homepage. Rhythm is the feature.",
		gap: "Weekly shipping note tied to real commits."
	});
	if (profile.domainRating != null && profile.domainRating < 10) add({
		theme: "No one can find it",
		severity: "medium",
		quote: `${name} has weak domain authority. People who would pay cannot discover it outside screenshots.`,
		howToFix: "Ship comparison pages against the two obvious incumbents, a public template gallery, and one genuinely useful free tool for inbound.",
		gap: "Comparison pages and a free inbound tool."
	});
	if (profile.estimatedUsers && /^0\b/.test(profile.estimatedUsers.trim())) add({
		theme: "Empty-room social proof",
		severity: "high",
		quote: `${name} lists ~0 users. Even with revenue, the site will feel like a ghost town unless you manufacture proof carefully.`,
		howToFix: "Lead with verified revenue and 3 named case snippets, not fake logos. A live counter of jobs done this week beats a testimonial wall.",
		gap: "Live 'jobs done' counter instead of fake logos."
	});
	return plays;
}
function fromReviews(reviews, name) {
	const out = [];
	for (const r of reviews) {
		if (out.length >= 4) break;
		const body = r.body.replace(/\s+/g, " ").trim();
		if (body.length < 40) continue;
		const theme = /pric|bill|expens|cost|refund|paywall|ads?\b/i.test(body) ? "Pricing, ads, and refunds" : /slow|latency|down|outage|crash/i.test(body) ? "Reliability" : /support|reply|response|ban/i.test(body) ? "Support silence" : /bug|broken|crash|error/i.test(body) ? "Bugs in the core loop" : /confus|onboard|ui|ux|docs/i.test(body) ? "Confusing product" : /lead|bounce|stale|email/i.test(body) ? "Data quality" : /login|account|auth/i.test(body) ? "Account traps" : `What ${r.source} is actually saying`;
		out.push({
			theme,
			severity: /scam|refund|broken|hate|worst|unusable|crash/i.test(body) ? "critical" : "high",
			quote: body.length > 280 ? `${body.slice(0, 277)}…` : body,
			source: r.source,
			sourced: r.source !== "Product site",
			howToFix: `Treat this as the wedge. Your MVP should make this complaint impossible: design the first-run and the primary screen so '${theme.toLowerCase()}' cannot be said about the new ${name} killer.`
		});
	}
	return out;
}
function stackFor(profile) {
	const b = blob(profile);
	if (profile.kind === "appstore" || profile.kind === "playstore" || /ios|android|mobile app/.test(b) && /react native|flutter/.test(b)) return {
		recommendation: "Expo + Postgres + Stripe",
		reason: "Stay cross-platform without a native team. Ship TestFlight / Play internal in week one.",
		pieces: [
			"Expo",
			"Expo Router",
			"Postgres",
			"Stripe",
			"Tailwind"
		]
	};
	return {
		recommendation: "TanStack Start + Postgres + Stripe",
		reason: "One TypeScript repo, server functions, and a billing path a solo builder can finish in a week.",
		pieces: [
			"TanStack Start",
			"React",
			"Tailwind",
			"Postgres",
			"Stripe",
			"Resend"
		]
	};
}
function buildLocalBrief(input) {
	const { profile, reviews, websiteText } = input;
	const plays = playbook(profile, websiteText);
	const sourced = fromReviews(reviews, profile.name);
	const inferred = plays.slice(0, 6).map((p) => ({
		theme: p.theme,
		severity: p.severity,
		quote: p.quote,
		source: "Product traces",
		sourced: false,
		howToFix: p.howToFix
	}));
	const complaints = [];
	for (const c of [...sourced, ...inferred]) {
		if (complaints.some((x) => x.theme === c.theme)) continue;
		complaints.push(c);
		if (complaints.length >= 6) break;
	}
	if (complaints.length === 0) complaints.push({
		theme: "Undifferentiated clone bait",
		severity: "high",
		quote: `${profile.name} already has demand — but the first-run and pricing story are still there to steal.`,
		source: "Product traces",
		sourced: false,
		howToFix: "Copy the category, not the UI. Make the first three minutes and the bill the reasons to switch."
	});
	const betterName = pickName(profile);
	const who = profile.insights["Target persona"] || profile.insights["Audience type"]?.replace(/\[|\]/g, "") || (isAskKind(profile.kind) ? `people already asking for this on ${profile.sourceLabel}` : `people already paying for ${firstMarket(profile)}`);
	const whyNow = profile.kind === "twitter" ? `The tweet is live. Demand is typed in public — ship before the thread dies.` : profile.kind === "reddit" ? `The thread is live. Demand is typed out in public — ship before the next Show HN.` : profile.kind === "hackernews" ? `HN is already arguing. The comments are the QA script.` : profile.kind === "appstore" || profile.kind === "playstore" || profile.kind === "firefox" ? `${profile.name} is on the charts${profile.rating ? ` at ${profile.rating.toFixed(1)} stars` : ""}. The 1-stars are a product spec.` : profile.kind === "github" ? `${profile.name} already has stars. The open issues are the 1-stars.` : profile.revenue.last30Days >= 1e3 ? `${profile.name} just did real revenue. Demand is proven; the reviews (or the gaps) tell you what to steal.` : `This is public demand on ${profile.sourceLabel}. A sharper first-run can take the next cohort.`;
	const gaps = [...plays.map((p) => p.gap), websiteText && /sign in|log in|book a demo/i.test(websiteText) ? "Self-serve instead of demo-gated." : ""].filter(Boolean).filter((g, i, a) => a.indexOf(g) === i).slice(0, 6);
	const stack = stackFor(profile);
	const top = complaints[0];
	const slug = hitKey(profile.kind, profile.id);
	return attachDetailedPrompts({
		productName: profile.name,
		slug,
		thesis: isAskKind(profile.kind) ? `${profile.sourceLabel} already wrote the spec. ${betterName} wins by shipping “${top.theme.toLowerCase()}” as the first screen, not a landing page that restates the thread.` : `${profile.name} is already getting attention on ${profile.sourceLabel}. ${betterName} wins by making “${top.theme.toLowerCase()}” a non-issue and shipping that as the first screen, not a v2 promise.`,
		opportunity: {
			betterName,
			positioning: `The ${firstMarket(profile)} that treats “${top.theme.toLowerCase()}” as the product.`,
			whoItsFor: who,
			whyNow
		},
		complaints,
		gaps: gaps.length ? gaps : ["A first-run that produces a result before settings."],
		vibeGuide: [],
		stack,
		mvpScope: [
			`Homepage that names the wedge against ${isAskKind(profile.kind) ? "this ask" : profile.name}`,
			"Auth + workspace with sample data",
			`Core loop that prevents: ${top.theme}`,
			"Pricing page + Stripe checkout + quota chip",
			"Changelog and comparison page"
		],
		outOfScope: [
			profile.kind === "appstore" || profile.kind === "playstore" ? "Every native SDK the incumbent ships" : "Native mobile",
			"Multiplayer / teams beyond a single workspace",
			"Every integration the incumbent lists",
			"Custom model training",
			"Marketplace or plugins"
		],
		launch: {
			firstUsers: isAskKind(profile.kind) ? `Reply on ${profile.sourceLabel} with the comparison page and a working first win. The original URL: ${profile.sourceUrl}.` : `Go where ${profile.name} is already discussed (${profile.sourceLabel}, 1-star reviews, category subreddits) and reply with the comparison page, not a waitlist screenshot.`,
			pricing: profile.insights["Pricing model"] ? `Undercut opacity, not necessarily price. Mirror ${profile.insights["Pricing model"]} but add a useful free tier and an estimator.` : "Free tier that completes one real job, then a simple monthly that is easy to explain on a pricing page.",
			differentiator: top.howToFix
		},
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		origin: "traces"
	}, profile, reviews);
}
var appCache = /* @__PURE__ */ new Map();
var CATEGORIES = [
	{
		path: "PRODUCTIVITY",
		tag: "Productivity"
	},
	{
		path: "PHOTOGRAPHY",
		tag: "Photo"
	},
	{
		path: "FINANCE",
		tag: "Finance"
	},
	{
		path: "HEALTH_AND_FITNESS",
		tag: "Health"
	}
];
function remember$1(app) {
	const prev = appCache.get(app.id);
	appCache.set(app.id, prev ? {
		...prev,
		...app,
		description: app.description || prev.description
	} : app);
}
function parseListings(html, tag) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const re = /href="\/store\/apps\/details\?id=([a-zA-Z][\w]*(?:\.[a-zA-Z][\w]*)+)"[^>]*>([\s\S]*?)<\/a>/g;
	let m;
	while (m = re.exec(html)) {
		const id = m[1];
		if (seen.has(id)) continue;
		seen.add(id);
		const inner = m[2];
		const text = stripHtml$1(inner);
		const rated = inner.match(/Rated ([0-9.]+) stars/i)?.[1];
		const img = inner.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null;
		const name = decodeEntities$1((inner.match(/class="[^"]*Epkrse[^"]*"[^>]*>([^<]+)/i)?.[1] || text.split(" star")[0] || id).trim());
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
			url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`
		});
	}
	return out;
}
function parseDetails(html, id) {
	const name = decodeEntities$1(html.match(/itemprop="name">([^<]+)/)?.[1] ?? "");
	const description = stripHtml$1(html.match(/itemprop="description"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "").slice(0, 1600);
	const rating = Number(html.match(/Rated ([0-9.]+) stars out of five stars/i)?.[1] ?? "");
	const reviewsLabel = html.match(/class="g1rdde">([^<]+)<\/div>/)?.[1] ?? null;
	const installs = html.match(/([0-9][0-9.,]*\s*[KMB]?\+?)<\/div>\s*<div[^>]*>Downloads/i)?.[1] ?? html.match(/([0-9][0-9.,]*[KMB]?\+)\s*downloads/i)?.[1] ?? null;
	const icon = html.match(/<img[^>]+src="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"[^>]{0,200}(?:alt="[^"]*"|itemprop="image")/i)?.[1] ?? html.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"]+=s256[^"]*/)?.[0] ?? null;
	const developer = decodeEntities$1(html.match(/href="\/store\/apps\/dev(?:eloper)?\?id=[^"]+">([^<]+)/)?.[1] ?? html.match(/href="\/store\/apps\/developer\?id=[^"]+">([^<]+)/)?.[1] ?? "") || null;
	return {
		id,
		name: name || void 0,
		description,
		rating: Number.isFinite(rating) && rating > 0 ? rating : void 0,
		ratingsLabel: reviewsLabel,
		installs: installs ? stripHtml$1(installs) : null,
		icon,
		developer,
		url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`
	};
}
function parsePlayReviews(html, id) {
	const bodies = [...html.matchAll(/class="h3YV2d"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => stripHtml$1(m[1]));
	const out = [];
	const NEG = /\b(ads?|crash|bug|slow|refund|cancel|paywall|expensive|broken|hate|worst|unusable|force|bloat|login|account|ban)\b/i;
	for (const body of bodies) {
		if (body.length < 40) continue;
		if (!NEG.test(body) && out.length >= 2) continue;
		out.push({
			source: "Play Store",
			title: NEG.test(body) ? "Critical review" : "User review",
			url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`,
			body: body.slice(0, 420)
		});
		if (out.length >= 8) break;
	}
	return out;
}
function toHit$1(app) {
	const flinch = (app.rating ?? 5) < 4.55;
	return {
		kind: "playstore",
		id: app.id,
		name: app.name,
		description: app.description.slice(0, 220) || `${app.category ?? "Android"} · ${formatRating(app.rating)} on Play`,
		icon: app.icon,
		category: app.category,
		sourceUrl: app.url,
		stats: [{
			label: "Rating",
			value: formatRating(app.rating),
			tone: flinch ? "pain" : "money"
		}, {
			label: "Chart",
			value: app.category ?? "Play"
		}],
		badges: [app.category ?? "Play", ...flinch ? ["Open flank"] : []],
		tags: [app.category ?? "play", flinch ? "flinch" : "solid"],
		painPreview: flinch ? `${formatRating(app.rating)} stars on a charting Android app.` : null
	};
}
async function loadPlayStoreFeed() {
	const cached = readCache$1("desk:playstore", 6e5);
	if (cached) return cached;
	const pages = await Promise.all(CATEGORIES.map(async (c) => {
		const html = await fetchText$1(`https://play.google.com/store/apps/category/${c.path}?hl=en&gl=us`, {
			timeoutMs: 1e4,
			ua: BROWSER_UA,
			maxBytes: 18e5
		});
		return html ? parseListings(html, c.tag) : [];
	}));
	const merged = /* @__PURE__ */ new Map();
	for (const list of pages) for (const app of list) if (!merged.has(app.id)) merged.set(app.id, app);
	const apps = Array.from(merged.values());
	for (const app of apps) remember$1(app);
	return writeCache$1("desk:playstore", apps.filter((a) => a.rating != null).sort((a, b) => (a.rating ?? 5) - (b.rating ?? 5) || a.name.localeCompare(b.name)).slice(0, 36).map(toHit$1));
}
async function loadPlayStoreProfile(id) {
	const key = `play:${id}`;
	const cached = readCache$1(key, 72e4);
	if (cached) return cached;
	const html = await fetchText$1(`https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=en&gl=us`, {
		timeoutMs: 12e3,
		ua: BROWSER_UA,
		maxBytes: 18e5
	});
	if (!html) throw new Error("Google Play did not return this listing.");
	const parsed = parseDetails(html, id);
	const listed = appCache.get(id);
	const app = {
		id,
		name: parsed.name || listed?.name || id,
		icon: parsed.icon || listed?.icon || null,
		category: listed?.category ?? null,
		rating: parsed.rating ?? listed?.rating ?? null,
		ratingsLabel: parsed.ratingsLabel ?? null,
		description: parsed.description || listed?.description || "",
		developer: parsed.developer || listed?.developer || null,
		installs: parsed.installs || null,
		url: `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`
	};
	remember$1(app);
	const reviews = parsePlayReviews(html, id);
	return writeCache$1(key, {
		profile: emptyTarget({
			kind: "playstore",
			id: app.id,
			name: app.name,
			description: app.description.slice(0, 1200),
			icon: app.icon,
			category: app.category,
			website: app.url,
			sourceUrl: app.url,
			sourceLabel: "Play Store",
			developer: app.developer,
			extra: {
				installs: app.installs ?? "",
				ratings: app.ratingsLabel ?? ""
			},
			rating: app.rating,
			installs: app.installs
		}),
		reviews
	});
}
var postCache = /* @__PURE__ */ new Map();
var DEMAND = /\b(i wish|looking for|need an? (app|tool|site|plugin)|is there an? (app|tool)|someone (please )?make|somebody make|app idea|build me|why isn'?t there|alternative to|replace .{3,20} with)\b/i;
function remember(post) {
	postCache.set(post.id, post);
}
function peekRedditPost(id) {
	return postCache.get(id) ?? null;
}
function tagPost(p) {
	const tags = new Set(p.tags);
	const sub = p.subreddit.toLowerCase();
	if (sub === "somebodymakethis") tags.add("request");
	if (sub === "appideas" || sub === "lightsab") tags.add("idea");
	if (sub === "saas" || sub === "microsaas" || sub === "startups") tags.add("saas");
	if (DEMAND.test(`${p.title} ${p.body}`)) tags.add("request");
	return Array.from(tags);
}
function toHit(p) {
	const tags = tagPost(p);
	return {
		kind: "reddit",
		id: p.id,
		name: p.title,
		description: p.body.slice(0, 220) || `A request in r/${p.subreddit}.`,
		icon: null,
		category: `r/${p.subreddit}`,
		sourceUrl: p.permalink,
		stats: [{
			label: "Score",
			value: formatCount(p.score)
		}, {
			label: "Comments",
			value: formatCount(p.comments)
		}],
		badges: tags.filter((t) => t !== "request" || tags.length === 1).slice(0, 2),
		tags,
		painPreview: p.body.slice(0, 180) || null
	};
}
function fromArctic(raw) {
	const id = String(raw.id ?? "").replace(/^t3_/, "");
	const title = stripHtml$1(String(raw.title ?? "")).trim();
	if (!id || !title || title.length < 12) return null;
	if (/monthly thread|creator showcase|megathread|daily thread/i.test(title)) return null;
	const sub = String(raw.subreddit ?? "reddit").replace(/^r\//, "");
	const body = stripHtml$1(String(raw.selftext ?? raw.body ?? ""));
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
		permalink: permalink ? `https://www.reddit.com${permalink.startsWith("/") ? permalink : `/${permalink}`}` : `https://www.reddit.com/comments/${id}`,
		flair: raw.link_flair_text ? String(raw.link_flair_text) : null,
		tags: []
	};
}
async function arcticSub(subreddit, limit = 25) {
	const json = await fetchJson$1(`https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=${encodeURIComponent(subreddit)}&limit=${limit}`, { timeoutMs: 9e3 });
	if (!json || typeof json !== "object") return [];
	const data = json.data;
	if (!Array.isArray(data)) return [];
	const out = [];
	for (const item of data) {
		if (!item || typeof item !== "object") continue;
		const post = fromArctic(item);
		if (post) out.push(post);
	}
	return out;
}
function parseRss(xml, fallbackSub) {
	const entries = xml.split(/<entry>/i).slice(1);
	const out = [];
	for (const chunk of entries) {
		const title = stripHtml$1((chunk.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, ""));
		if (!title || /monthly thread|creator showcase/i.test(title)) continue;
		const link = chunk.match(/<link[^>]+href="([^"]+)"/i)?.[1] ?? "";
		const id = link.match(/comments\/([a-z0-9]+)/i)?.[1];
		if (!id) continue;
		const content = chunk.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] ?? "";
		const author = stripHtml$1(chunk.match(/<name>([\s\S]*?)<\/name>/i)?.[1] ?? "");
		const category = chunk.match(/<category[^>]+label="r\/([^"]+)"/i)?.[1] ?? fallbackSub;
		const body = stripHtml$1(content.replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&")).slice(0, 1800);
		out.push({
			id,
			subreddit: category,
			title,
			body,
			author,
			score: 0,
			comments: 0,
			createdUtc: Date.parse(chunk.match(/<updated>([^<]+)<\/updated>/i)?.[1] ?? "") / 1e3 || 0,
			permalink: link.split("?")[0] || `https://www.reddit.com/comments/${id}`,
			flair: null,
			tags: []
		});
	}
	return out;
}
async function rssFeed(url, sub) {
	const xml = await fetchText$1(url, {
		timeoutMs: 8e3,
		ua: BROWSER_UA,
		maxBytes: 2e5
	});
	if (!xml || !xml.includes("<entry")) return [];
	return parseRss(xml, sub);
}
function mergePosts(lists) {
	const map = /* @__PURE__ */ new Map();
	for (const list of lists) for (const p of list) {
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
			title: prev.title || p.title
		});
	}
	return Array.from(map.values());
}
function isDemand(p) {
	const sub = p.subreddit.toLowerCase();
	if (sub === "somebodymakethis" || sub === "appideas") return p.title.length > 16;
	return DEMAND.test(`${p.title} ${p.body}`);
}
async function loadRedditFeed() {
	const cached = readCache$1("desk:reddit", 48e4);
	if (cached) return cached;
	const [smt, ideas, saasArctic, smtRss, saasRss] = await Promise.all([
		arcticSub("SomebodyMakeThis", 30).catch(() => []),
		arcticSub("AppIdeas", 20).catch(() => []),
		arcticSub("SaaS", 20).catch(() => []),
		rssFeed("https://www.reddit.com/r/SomebodyMakeThis/.rss", "SomebodyMakeThis"),
		rssFeed("https://www.reddit.com/r/SaaS/search.rss?q=looking+for+OR+%22i+wish%22+OR+%22is+there+an+app%22&sort=new&restrict_sr=1", "SaaS")
	]);
	const merged = mergePosts([
		smt,
		ideas,
		saasArctic,
		smtRss,
		saasRss
	]).filter(isDemand).sort((a, b) => b.comments + b.score * .3 - (a.comments + a.score * .3) || b.createdUtc - a.createdUtc).slice(0, 36);
	for (const p of merged) remember(p);
	return writeCache$1("desk:reddit", merged.map(toHit));
}
async function loadComments(id) {
	const json = await fetchJson$1(`https://arctic-shift.photon-reddit.com/api/comments/search?link_id=t3_${id}&limit=20`, { timeoutMs: 8e3 });
	if (!json || typeof json !== "object") return [];
	const data = json.data;
	if (!Array.isArray(data)) return [];
	const out = [];
	for (const item of data) {
		if (!item || typeof item !== "object") continue;
		const rec = item;
		const body = stripHtml$1(String(rec.body ?? ""));
		if (body.length < 40 || body === "[deleted]" || body === "[removed]") continue;
		if (/^i am a bot|automod/i.test(body)) continue;
		out.push({
			source: `u/${String(rec.author ?? "reddit")}`,
			title: "Thread comment",
			url: `https://www.reddit.com${String(rec.permalink ?? `/comments/${id}`)}`,
			body: body.slice(0, 420)
		});
		if (out.length >= 8) break;
	}
	return out;
}
async function loadRedditProfile(id) {
	const key = `reddit:${id}`;
	const cached = readCache$1(key, 72e4);
	if (cached) return cached;
	let post = peekRedditPost(id);
	if (!post) {
		const json = await fetchJson$1(`https://arctic-shift.photon-reddit.com/api/posts/search?ids=${id}`, { timeoutMs: 8e3 });
		const data = json && typeof json === "object" ? json.data : null;
		if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
			const parsed = fromArctic(data[0]);
			if (parsed) post = parsed;
		}
	}
	if (!post) post = (await rssFeed(`https://www.reddit.com/comments/${id}.rss`, "reddit"))[0] ?? null;
	if (!post) throw new Error("That Reddit thread could not be loaded.");
	remember(post);
	const comments = await loadComments(id);
	const reviews = [{
		source: `r/${post.subreddit}`,
		title: post.title,
		url: post.permalink,
		body: (post.body || post.title).slice(0, 600)
	}, ...comments];
	return writeCache$1(key, {
		profile: emptyTarget({
			kind: "reddit",
			id: post.id,
			name: post.title,
			description: post.body.slice(0, 900) || `A request posted in r/${post.subreddit}.`,
			category: `r/${post.subreddit}`,
			website: post.permalink,
			sourceUrl: post.permalink,
			sourceLabel: `r/${post.subreddit}`,
			developer: post.author ? `u/${post.author}` : null,
			extra: {
				flair: post.flair ?? "",
				author: post.author
			},
			score: post.score,
			comments: post.comments,
			subreddit: post.subreddit
		}),
		reviews
	});
}
var UA$1 = "Riposte/1.0 (https://grok.com; product research desk)";
var NEGATIVE = /\b(scam|refund|cancel+ed|overpriced?|broken|worst|hate|bug|slow|expensive|lock-?in|misleading|terrible|useless|billing|hidden fee|doesn't work|does not work|don't work|support|unreliable|buggy|outage|chargeback|complaint|frustrating|confusing|onboarding|waitlist|paywall|demo|enterprise)\b/i;
function decodeEntities(html) {
	return html.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/"/gi, "\"").replace(/&#39;|'/gi, "'").replace(/</gi, "<").replace(/>/gi, ">").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(Number.parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function stripHtml(html) {
	return decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function mentions(text, name) {
	if (!name || name.length < 3) return false;
	return new RegExp(`\\b${escapeRe(name)}\\b`, "i").test(text);
}
async function fetchText(url, timeoutMs = 6e3) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA$1,
				Accept: "text/html,application/json;q=0.9,*/*;q=0.8"
			},
			signal: AbortSignal.timeout(timeoutMs),
			redirect: "follow"
		});
		if (!res.ok) return null;
		const buf = await res.arrayBuffer();
		const slice = buf.byteLength > 4e5 ? buf.slice(0, 4e5) : buf;
		return new TextDecoder("utf-8", { fatal: false }).decode(slice);
	} catch {
		return null;
	}
}
function hostOf(website) {
	if (!website) return "";
	try {
		return new URL(website).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
async function fetchWebsiteText(website) {
	if (!website) return null;
	let url = website;
	try {
		const parsed = new URL(website);
		if (!["http:", "https:"].includes(parsed.protocol)) return null;
		url = parsed.toString().replace(/\/$/, "");
	} catch {
		return null;
	}
	const pages = await Promise.all([
		"",
		"/pricing",
		"/price",
		"/faq",
		"/reviews"
	].map((p) => fetchText(url + p, 5500)));
	const chunks = [];
	for (const html of pages) {
		if (!html) continue;
		const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
		const jsonLd = extractJsonLdReviews(html);
		const text = stripHtml(html).slice(0, 4500);
		if (title) chunks.push(`Title: ${stripHtml(title)}`);
		if (jsonLd) chunks.push(jsonLd);
		if (text) chunks.push(text);
	}
	if (!chunks.length) return null;
	return chunks.join("\n").slice(0, 8e3);
}
function extractJsonLdReviews(html) {
	const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
	const lines = [];
	for (const m of blocks) try {
		walkLd(JSON.parse(m[1]), lines);
	} catch {}
	return lines.length ? `Structured reviews:\n${lines.slice(0, 8).join("\n")}` : null;
}
function walkLd(node, lines, depth = 0) {
	if (!node || depth > 6 || lines.length >= 8) return;
	if (Array.isArray(node)) {
		for (const item of node) walkLd(item, lines, depth + 1);
		return;
	}
	if (typeof node !== "object") return;
	const rec = node;
	const type = String(rec["@type"] ?? rec.type ?? "");
	if (/review/i.test(type)) {
		const value = rec.reviewRating?.ratingValue ?? rec.ratingValue;
		const body = String(rec.reviewBody ?? rec.description ?? "").slice(0, 280);
		if (body) lines.push(`- rating ${value ?? "?"}: ${body}`);
	}
	for (const v of Object.values(rec)) walkLd(v, lines, depth + 1);
}
async function fetchPullpush(name) {
	if (name.replace(/[^a-z0-9]/gi, "").length < 5) return [];
	const q = encodeURIComponent(`"${name}" (scam OR refund OR broken OR overpriced OR complaint OR worst OR billing)`);
	const [subs, comments] = await Promise.all([fetchText(`https://api.pullpush.io/reddit/search/submission/?q=${q}&size=20`, 6e3), fetchText(`https://api.pullpush.io/reddit/search/comment/?q=${q}&size=20`, 6e3)]);
	const out = [];
	const ingest = (raw, kind) => {
		if (!raw) return;
		try {
			const json = JSON.parse(raw);
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
					body: (body || title).slice(0, 420)
				});
			}
		} catch {}
	};
	ingest(subs, "post");
	ingest(comments, "comment");
	return unique(out).slice(0, 8);
}
async function fetchHn(name, host) {
	const queries = [`"${name}"`, host ? host : ""].filter(Boolean);
	const out = [];
	await Promise.all(queries.map(async (q) => {
		const raw = await fetchText(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&hitsPerPage=12`, 5500);
		if (!raw) return;
		try {
			const json = JSON.parse(raw);
			for (const hit of json.hits ?? []) {
				const title = stripHtml(hit.title || hit.story_title || "HN");
				const body = stripHtml(hit.comment_text || title);
				const hay = `${title} ${body}`;
				if (!(mentions(hay, name) || host && hay.toLowerCase().includes(host.toLowerCase()))) continue;
				if (!NEGATIVE.test(hay) && !mentions(hay, name)) continue;
				out.push({
					source: "Hacker News",
					title,
					url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
					body: body.slice(0, 420)
				});
			}
		} catch {}
	}));
	return unique(out).slice(0, 6);
}
function unique(items) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of items) {
		const key = `${item.url}|${item.body.slice(0, 80)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
}
function reviewsFromWebsite(websiteText, name, website) {
	if (!websiteText) return [];
	const url = website || "#";
	const out = [];
	const structured = websiteText.match(/Structured reviews:\n([\s\S]*?)(?:\n[A-Z]|$)/);
	if (structured?.[1]) for (const line of structured[1].split("\n")) {
		const body = line.replace(/^-+\s*/, "").trim();
		if (body.length < 24) continue;
		out.push({
			source: "Product site",
			title: "Published review",
			url,
			body: body.slice(0, 420)
		});
	}
	const SITE_PAIN = /\b(refund|overpriced?|hidden fee|doesn't work|does not work|no refund|non-refundable|waitlist|contact (us )?for pricing|book a demo|talk to sales)\b/i;
	const sentences = websiteText.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 40 && s.length < 280 && SITE_PAIN.test(s));
	for (const sentence of sentences.slice(0, 4)) out.push({
		source: "Product site",
		title: `${name} copy`,
		url,
		body: sentence
	});
	return unique(out).slice(0, 6);
}
async function gatherReviews(name, website) {
	const host = hostOf(website);
	const [reddit, hn] = await Promise.all([fetchPullpush(name), fetchHn(name, host)]);
	return unique([...reddit, ...hn]).slice(0, 10);
}
var UA = "Riposte/1.0 (https://grok.com; product research desk)";
var DISCOVERY = "https://trustmrr.com/api/ai/discovery";
var MARKETPLACE = "https://trustmrr.com/api/ai";
var cache = /* @__PURE__ */ new Map();
function readCache(key, ttlMs) {
	const hit = cache.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > ttlMs) {
		cache.delete(key);
		return null;
	}
	return hit.value;
}
function writeCache(key, value) {
	cache.set(key, {
		at: Date.now(),
		value
	});
	return value;
}
async function fetchJson(url) {
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`TrustMRR returned ${res.status}`);
	return res.json();
}
function num(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string") {
		const n = Number(v.replace(/[$,]/g, ""));
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function str(v) {
	if (typeof v === "string" && v.trim()) return v.trim();
	return null;
}
function revenueOf(raw) {
	const r = raw ?? {};
	return {
		last30Days: num(r.last30Days),
		mrr: num(r.mrr),
		total: num(r.total)
	};
}
function normalize(raw, source) {
	const slug = str(raw.slug)?.toLowerCase();
	const name = str(raw.name);
	if (!slug || !name) return null;
	const stealth = Boolean(raw.stealthMode);
	return {
		name: stealth ? "Stealth startup" : name,
		slug,
		url: str(raw.url) ?? `https://trustmrr.com/startup/${slug}`,
		icon: stealth ? null : str(raw.icon),
		description: stealth ? "Hidden while the founder ships in public." : str(raw.description) ?? "",
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
		sources: [source]
	};
}
function merge(existing, next) {
	if (!existing) return next;
	const sources = Array.from(/* @__PURE__ */ new Set([...existing.sources, ...next.sources]));
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
			total: Math.max(existing.revenue.total, next.revenue.total)
		},
		growth30d: Math.abs(next.growth30d) > Math.abs(existing.growth30d) ? next.growth30d : existing.growth30d,
		onSale: existing.onSale || next.onSale,
		askingPrice: next.askingPrice ?? existing.askingPrice,
		multiple: next.multiple ?? existing.multiple,
		sources
	};
}
function byRevenue(a, b) {
	return b.revenue.last30Days - a.revenue.last30Days || b.revenue.mrr - a.revenue.mrr;
}
function earnsWell(p) {
	return p.revenue.last30Days >= 500 || p.revenue.mrr >= 200;
}
async function loadScoutFeed() {
	const cached = readCache("scout", 3e5);
	if (cached) return cached;
	const [discovery, marketplace] = await Promise.all([fetchJson(DISCOVERY), fetchJson(MARKETPLACE).catch(() => null)]);
	const map = /* @__PURE__ */ new Map();
	const ingest = (list, source) => {
		if (!Array.isArray(list)) return;
		for (const item of list) {
			if (!item || typeof item !== "object") continue;
			const product = normalize(item, source);
			if (!product) continue;
			map.set(product.slug, merge(map.get(product.slug), product));
		}
	};
	ingest(discovery?.recentlyAddedStartups, "recent");
	ingest(discovery?.fastestGrowingStartups, "growing");
	ingest(marketplace?.recentlyListedStartups, "listed");
	ingest(marketplace?.bestDeals, "deal");
	const all = Array.from(map.values());
	return writeCache("scout", {
		earning: all.filter(earnsWell).sort(byRevenue),
		growing: all.filter((p) => p.sources.includes("growing")).sort((a, b) => b.growth30d - a.growth30d || byRevenue(a, b)),
		recent: all.filter((p) => p.sources.includes("recent")).sort(byRevenue),
		listed: all.filter((p) => p.onSale || p.sources.includes("listed") || p.sources.includes("deal")).sort(byRevenue),
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
async function loadStartupProfile(slug) {
	const key = `profile:${slug}`;
	const cached = readCache(key, 6e5);
	if (cached) return cached;
	const markdownUrl = `https://trustmrr.com/startup/${slug}.md`;
	const res = await fetch(markdownUrl, {
		headers: {
			Accept: "text/markdown, text/plain",
			"User-Agent": UA
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (res.status === 404) throw new Error("This startup is not on TrustMRR.");
	if (!res.ok) throw new Error(`TrustMRR returned ${res.status}`);
	const markdown = await res.text();
	if (/page not found/i.test(markdown) && markdown.length < 400) throw new Error("This startup is not on TrustMRR.");
	return writeCache(key, parseMarkdownProfile(slug, markdown));
}
function bulletMap(section) {
	const out = {};
	for (const line of section.split("\n")) {
		const m = line.match(/^-\s+\*?([^:*]+)\*?:\s*(.+)$/);
		if (!m) continue;
		const key = m[1].trim();
		const val = m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`/g, "").trim();
		if (key && val) out[key] = val;
	}
	return out;
}
function parseMoneyish(raw) {
	if (!raw) return 0;
	const cleaned = raw.replace(/,/g, "").match(/-?\$?([\d.]+)\s*([kKmMbB])?/);
	if (!cleaned) return 0;
	const n = Number(cleaned[1]);
	if (!Number.isFinite(n)) return 0;
	const suffix = (cleaned[2] || "").toLowerCase();
	if (suffix === "k") return n * 1e3;
	if (suffix === "m") return n * 1e6;
	if (suffix === "b") return n * 1e9;
	return n;
}
function mdSection(markdown, heading) {
	const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, "i");
	return markdown.match(re)?.[1]?.trim() ?? "";
}
function parseMarkdownProfile(slug, markdown) {
	const profileSec = mdSection(markdown, "Profile");
	const insightsSec = mdSection(markdown, "Startup Insights");
	const stackSec = mdSection(markdown, "Tech Stack");
	const distSec = mdSection(markdown, "Distribution");
	const revenueSec = mdSection(markdown, "Revenue");
	const metricsSec = mdSection(markdown, "Metric Snapshots");
	const profile = bulletMap(profileSec);
	const insights = bulletMap(insightsSec);
	const metrics = bulletMap(metricsSec);
	const techStack = {};
	for (const line of stackSec.split("\n")) {
		const m = line.match(/^-\s+\*?([^:]+)\*?:\s*(.+)$/);
		if (!m) continue;
		const items = m[2].split(",").map((s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim()).filter(Boolean);
		if (items.length) techStack[m[1].trim()] = items;
	}
	const marketingChannels = [];
	for (const line of distSec.split("\n")) {
		const m = line.match(/Marketing channels:\s*(.+)$/i);
		if (m) marketingChannels.push(...m[1].split(",").map((s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim()).filter(Boolean));
	}
	const revenueTable = [];
	for (const line of revenueSec.split("\n")) {
		const row = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
		if (!row) continue;
		const period = row[1].trim();
		const amount = row[2].trim();
		if (/period/i.test(period) || /^-+$/.test(period.replace(/\s/g, ""))) continue;
		revenueTable.push({
			period,
			amount
		});
	}
	const last30 = parseMoneyish(metrics["Last 30 days revenue snapshot"]) || parseMoneyish(revenueTable.find((r) => /last 30/i.test(r.period))?.amount);
	const mrr = parseMoneyish(metrics["Current MRR"]);
	const total = parseMoneyish(metrics["All-time revenue snapshot"]) || parseMoneyish(revenueTable.find((r) => /all time/i.test(r.period))?.amount);
	const growthMatch = (metrics["Last 30 days revenue growth"] ?? "").replace(/,/g, "").match(/([+-]?[\d.]+)/);
	const growth30d = growthMatch ? Number(growthMatch[1]) : null;
	const mrrGrowthMatch = (metrics["Last 30 days MRR growth"] ?? "").replace(/,/g, "").match(/([+-]?[\d.]+)/);
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
		revenue: {
			last30Days: last30,
			mrr,
			total
		},
		growth30d,
		growthMRR30d: mrrGrowthMatch ? Number(mrrGrowthMatch[1]) : null,
		revenueTable: revenueTable.slice(0, 8),
		insights,
		techStack,
		marketingChannels,
		markdownExcerpt: markdown.slice(0, 7e3),
		github: githubMap["GitHub connected"] ? {
			connected: /yes/i.test(githubMap["GitHub connected"]),
			contrib30: Number.isFinite(contrib30) ? contrib30 : 0
		} : null,
		domainRating: Number.isFinite(domainRating) ? domainRating : null,
		estimatedUsers: insights["Estimated user count"] ?? null
	};
}
var TURSO_PIPELINE_URL = "https://projectmanage-sh15a.aws-ap-south-1.turso.io/v2/pipeline";
var TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODk4ODMxMTUsImlkIjoiMDFhMGJkNTItY2YwMS03MDNhLTgwNTEtYTZhZTVkNGM2NjY3Iiwia2lkIjoiUEJVVXJDMUljTkFQVmc5WEwyNWlsa1Z1amVTUlFNM0Nqb202b0VvSHpNbyIsInJpZCI6IjY4MTg1NGY0LTZmOTktNDQzNS1hZGI5LTcwNDgyMDJjYjVlYSJ9.A1O5Bwuj3A_T7SvZvaYNv-Iem-iWq0v-GT7R49Rbldqvj0ID1qubk0wsAl1Yho_XI_BqbhuEOjUDZNl9SEdNDQ";
var PROJECT_MANAGE_BASE_URL = "https://project-manage-z6u.pages.dev";
function slugify(text) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 40);
}
function normalizeTag(tag) {
	const t = (tag || "").toLowerCase();
	if (t.includes("game")) return "games";
	if (t.includes("saas") || t.includes("b2b")) return "saas";
	if (t.includes("tool") || t.includes("util") || t.includes("dev")) return "tool";
	if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("app")) return "app";
	if (t.includes("fun") || t.includes("toy")) return "made-for-fun";
	return "web-app";
}
function toArg(val) {
	if (val === null || val === void 0) return { type: "null" };
	if (typeof val === "number") return {
		type: "integer",
		value: String(val)
	};
	return {
		type: "text",
		value: String(val)
	};
}
async function pushIdeaToProjectHub(input) {
	const productName = (input.betterName || input.name).trim() || "Finder Idea";
	const productId = `finder-${(input.id ? slugify(input.id) : slugify(productName)) || Date.now()}`;
	const tag = normalizeTag(input.tag);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let finalDescription = (input.thesis || input.description || "").trim();
	if (input.sourceUrl && !finalDescription.includes(input.sourceUrl)) finalDescription = finalDescription ? `${finalDescription}\n\n[Mined from Finder: ${input.source || "Opportunity"}](${input.sourceUrl})` : `Mined from Finder: ${input.sourceUrl}`;
	const projectUrl = input.url || input.sourceUrl || null;
	const params = new URLSearchParams();
	params.set("action", "import-idea");
	params.set("id", productId);
	params.set("name", productName);
	if (finalDescription) params.set("desc", finalDescription.slice(0, 300));
	if (projectUrl) params.set("url", projectUrl);
	params.set("tag", tag);
	params.set("status", "idea");
	params.set("source", input.source || "Finder");
	if (input.sourceUrl) params.set("sourceUrl", input.sourceUrl);
	const manageUrl = `${PROJECT_MANAGE_BASE_URL}/?${params.toString()}`;
	let savedToTurso = false;
	try {
		const statements = [{
			sql: `INSERT INTO products (id, name, description, url, tag, status, sort_order, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 'idea', 0, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                url = excluded.url,
                tag = excluded.tag,
                updated_at = excluded.updated_at;`,
			args: [
				toArg(productId),
				toArg(productName),
				toArg(finalDescription || null),
				toArg(projectUrl),
				toArg(tag),
				toArg(now),
				toArg(now)
			]
		}];
		if (input.vibeGuide && input.vibeGuide.length > 0) input.vibeGuide.slice(0, 10).forEach((step, idx) => {
			const taskId = `${productId}-vibe-${step.step}`;
			const title = `Step ${step.step}: ${step.title}`;
			statements.push({
				sql: `INSERT OR REPLACE INTO tasks (id, product_id, title, section, section_id, status, done, sort_order, created_at)
                VALUES (?, ?, ?, 'Finder Vibe Plan', 99, 'not_started', 0, ?, ?);`,
				args: [
					toArg(taskId),
					toArg(productId),
					toArg(title),
					toArg(idx),
					toArg(now)
				]
			});
		});
		const payload = { requests: statements.map((stmt) => ({
			type: "execute",
			stmt
		})) };
		const res = await fetch(TURSO_PIPELINE_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(6e3)
		});
		if (res.ok) {
			const data = await res.json();
			if (!(Array.isArray(data.results) && data.results.some((r) => r.type === "error"))) savedToTurso = true;
			else console.warn("[pushIdeaToProjectHub] Turso statement errors:", data.results);
		} else console.warn(`[pushIdeaToProjectHub] Turso returned ${res.status}`);
	} catch (dbErr) {
		console.warn("[pushIdeaToProjectHub] Turso sync error:", dbErr);
	}
	return {
		ok: true,
		id: productId,
		name: productName,
		manageUrl,
		savedToTurso
	};
}
var GEMINI_DEFAULT_KEY = "AQ.Ab8RN6LAfvTPYRY4M327Eq9_I4KECJpIDIIcoIGgnhS1ikHA6w";
var OPENROUTER_DEFAULT_KEY = "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";
var catalogSummaryCache = null;
var CATALOG_TTL = 9e5;
async function getFinderCatalogSummary() {
	if (catalogSummaryCache && Date.now() - catalogSummaryCache.at < CATALOG_TTL) return catalogSummaryCache.summary;
	try {
		const [scoutFeed, redditHits, appStoreHits, playStoreHits] = await Promise.all([
			loadScoutFeed().catch(() => null),
			loadRedditFeed().catch(() => []),
			loadAppStoreFeed().catch(() => []),
			loadPlayStoreFeed().catch(() => [])
		]);
		const lines = [];
		lines.push("### 13 OPPORTUNITY DESKS ON FINDER:");
		lines.push("- TrustMRR: Verified MRR, revenue & growth startups with open flanks");
		lines.push("- Reddit: Real unmet requests and problem threads from r/SomebodyMakeThis, r/AppIdeas, r/SaaS");
		lines.push("- App Store: iOS top grossing apps with angry 1-star reviews revealing open market flanks");
		lines.push("- Play Store: Google Play Store hits with UI/UX friction and missing features");
		lines.push("- Twitter / X: Live requests ('I wish there was an app that...') and founder pain points");
		lines.push("- Product Hunt: Daily launches with comment feedback specs");
		lines.push("- Hacker News: Show HN and Ask HN launches with brutal developer critiques");
		lines.push("- GitHub: Trending repos whose issue trackers are product specs");
		lines.push("- BetaList, Lobsters, DEV, Firefox Add-ons, Launching Next");
		if (scoutFeed) {
			lines.push("\n### TOP VALIDATED REVENUE STARTUPS (TrustMRR Desk):");
			const topEarning = (scoutFeed.earning || []).slice(0, 12);
			for (const p of topEarning) {
				const mrrStr = p.revenue.mrr ? `$${Math.round(p.revenue.mrr).toLocaleString()}/mo` : "Verified";
				lines.push(`- [${p.name}](/hit/trustmrr/${p.slug}) | ${mrrStr} MRR | Category: ${p.category || "SaaS"} | Flank: ${p.description.slice(0, 160)}`);
			}
			const topGrowing = (scoutFeed.growing || []).slice(0, 8);
			lines.push("\n### FASTEST GROWING REVENUE STARTUPS:");
			for (const p of topGrowing) {
				const growthStr = p.growth30d ? `+${p.growth30d}% 30d growth` : "Rapid growth";
				lines.push(`- [${p.name}](/hit/trustmrr/${p.slug}) | ${growthStr} | ${p.description.slice(0, 140)}`);
			}
		}
		if (redditHits && redditHits.length > 0) {
			lines.push("\n### TOP REDDIT DEMAND REQUESTS (Unmet User Needs):");
			for (const r of redditHits.slice(0, 10)) lines.push(`- [${r.name}](/hit/reddit/${r.id}) | Category: ${r.category || "Reddit"} | Problem: ${r.description.slice(0, 160)}`);
		}
		if (appStoreHits && appStoreHits.length > 0) {
			lines.push("\n### APP STORE 1-STAR OPPORTUNITIES (iOS Flanks):");
			for (const a of appStoreHits.slice(0, 6)) lines.push(`- [${a.name}](/hit/appstore/${a.id}) | Category: ${a.category || "Mobile"} | Flank: ${a.description.slice(0, 150)}`);
		}
		if (playStoreHits && playStoreHits.length > 0) {
			lines.push("\n### GOOGLE PLAY 1-STAR OPPORTUNITIES (Android Flanks):");
			for (const g of playStoreHits.slice(0, 6)) lines.push(`- [${g.name}](/hit/playstore/${g.id}) | Category: ${g.category || "Android"} | Flank: ${g.description.slice(0, 150)}`);
		}
		const summary = lines.join("\n");
		catalogSummaryCache = {
			at: Date.now(),
			summary
		};
		return summary;
	} catch (err) {
		console.warn("[getFinderCatalogSummary] fallback to static catalog:", err);
		return `
### TOP FINDER VALIDATED STARTUPS:
- [Typeframes](/hit/trustmrr/typeframes) | $15.8k MRR | Video maker for SaaS, open flank: automated screen recorder with zoom
- [ScreenshotOne](/hit/trustmrr/screenshotone) | $27.2k MRR | Screenshot API, open flank: edge rendering and quick watermarking
- [Postiz](/hit/trustmrr/postiz) | $14.1k MRR | Open source social scheduling, open flank: simpler creator-focused buffer
- [Chatsimple](/hit/trustmrr/chatsimple) | $42.5k MRR | AI chatbot for website lead generation
- [HeadshotPro](/hit/trustmrr/headshotpro) | $185k MRR | AI professional headshots
- [Offline Calorie & Macro Tracker](/hit/appstore/calorie-counter) | App Store 1-Star Flank | Privacy-first, zero subscription calorie log
- [Freelance Micro-CRM](/hit/reddit/freelance-crm) | Reddit Demand | Minimalist pipeline for solo freelancers without HubSpot bloat
- [Simple Invoicing Tool](/hit/reddit/simple-invoice) | Reddit Demand | Clean PDF invoice generator without recurring monthly trap
- [GitHub Repo Issue Monitor](/hit/github/repo-tracker) | GitHub Desk | Instant Slack/Telegram alerts for open issues & PR reviews
    `.trim();
	}
}
function buildSystemPrompt(catalog, context) {
	let contextSection = "";
	if (context && context.name) contextSection = `
CURRENT PAGE CONTEXT (User is currently looking at this idea):
- Name: ${context.name}
- Desk: ${context.kind || "Finder"}
- Category: ${context.category || context.tag || "Software"}
- Description: ${context.description || "No description"}
${context.mrr ? `- Verified MRR: $${context.mrr}/mo` : ""}
${context.url ? `- Link: ${context.url}` : ""}
When relevant, reference this current opportunity directly and offer tailored strategic advice!
`;
	return `You are Finder AI Advisor (also known as the Riposte Startup Intelligence Agent) on Finder (https://finder-d17.pages.dev).
You specialize strictly and exclusively in helping builders discover, evaluate, rank, compare, and build the validated startup ideas and market opportunities listed on Finder.

${contextSection}

${catalog}

STRICT GUARDRAILS & INSTRUCTIONS:
1. ONLY answer questions about the startup ideas, apps, business opportunities, market flanks, execution blueprints, tech stacks, and builder workflows on Finder.
2. If the user asks general questions (e.g., "what are the app ideas?", "which one is the best?"), always recommend specific ideas from the Finder catalog with their category, why they are great opportunities, and link to their breakdown page using markdown [Idea Name](/hit/desk/id).
3. If the user asks which is the best for a solo developer or beginner, recommend 2-3 specific ideas with low operational complexity, high demand, and clean monetization (like the Freelance Micro-CRM or Offline Tracker).
4. If the user asks how to build or execute an idea, explain the core MVP scope, recommended modern stack (e.g. TanStack Start, React, Tailwind, SQLite/Turso or Supabase), and highlight that every idea on Finder has an automated 27-section Master Blueprint and vibe coding prompts.
5. Emphasize that users can click the "Push to Project Manage" button on any idea page to seamlessly import the project with an 817-task launch checklist into Project Manage (https://project-manage-z6u.pages.dev).
6. Highlight that founders can access the full ecosystem of 5 Product Factories & Launch Hubs via the "All Links" button:
   - Product Hub (https://project-manage-z6u.pages.dev) — Master launch OS with 817-task launch checklists
   - Bots Product Factory (https://botserusable.pages.dev) — Reusable bot modules for Telegram, Discord, Slack, and WhatsApp
   - AI Agent Product Factory (https://agentsreusable.pages.dev) — Modular AI agent scaffolding, tool runtimes, and memory
   - Mobile Product Factory (https://appreusable.pages.dev) — 163 mobile architecture modules for React Native, Flutter, iOS, and Android
   - Reusable Code Library (https://reusable-library.foundershivanand.workers.dev) — 33 enterprise modules (Auth, Payments, Storage, Rate Limiting)
7. OFF-TOPIC RULE: If the user asks about completely unrelated topics (cooking recipes, video games, homework, politics, celebrity gossip), politely decline in 1-2 friendly sentences and pivot back to Finder startup ideas.
8. Tone: Sharp, pragmatic, encouraging, and focused on indie hacker execution. Use bullet points and bold text for readability.`;
}
async function callGoogleGemini(systemPrompt, messages, apiKey) {
	const geminiModels = [
		"gemini-3.5-flash-lite",
		"gemini-3.8-flash",
		"gemini-3.1-flash-lite",
		"gemini-flash-lite-latest"
	];
	const contents = [];
	for (const m of messages.slice(-8)) {
		const role = m.role === "assistant" ? "model" : "user";
		if (contents.length > 0 && contents[contents.length - 1].role === role) contents[contents.length - 1].parts[0].text += "\n" + m.content;
		else contents.push({
			role,
			parts: [{ text: m.content }]
		});
	}
	while (contents.length > 0 && contents[0].role !== "user") contents.shift();
	if (contents.length === 0) contents.push({
		role: "user",
		parts: [{ text: "Hello Finder AI" }]
	});
	const payload = {
		system_instruction: { parts: [{ text: systemPrompt }] },
		contents,
		generationConfig: {
			maxOutputTokens: 850,
			temperature: .45
		}
	};
	for (const model of geminiModels) try {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey
			},
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(1e4)
		});
		if (res.ok) {
			const text = (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text?.trim();
			if (text) return text;
		} else {
			const errText = await res.text();
			console.warn(`[callGoogleGemini] ${model} HTTP ${res.status}:`, errText.slice(0, 140));
		}
	} catch (err) {
		console.warn(`[callGoogleGemini] ${model} error:`, err);
	}
	return null;
}
async function askAdvisor(messages, context) {
	const systemPrompt = buildSystemPrompt(await getFinderCatalogSummary(), context);
	const geminiKey = processModule.env.GEMINI_API_KEY || GEMINI_DEFAULT_KEY;
	if (geminiKey) {
		const geminiReply = await callGoogleGemini(systemPrompt, messages, geminiKey);
		if (geminiReply) return {
			ok: true,
			reply: geminiReply,
			suggestions: generateContextualSuggestions(geminiReply, context)
		};
	}
	const openRouterKey = processModule.env.OPENROUTER_API_KEY || OPENROUTER_DEFAULT_KEY;
	const apiMessages = [{
		role: "system",
		content: systemPrompt
	}, ...messages.slice(-8)];
	for (const model of ["google/gemini-2.5-flash", "meta-llama/llama-3.1-8b-instruct"]) try {
		const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${openRouterKey}`,
				"HTTP-Referer": "https://finder-d17.pages.dev",
				"X-Title": "Finder AI Advisor"
			},
			body: JSON.stringify({
				model,
				max_tokens: 850,
				temperature: .45,
				messages: apiMessages
			}),
			signal: AbortSignal.timeout(12e3)
		});
		if (res.ok) {
			const content = (await res.json()).choices?.[0]?.message?.content?.trim();
			if (content) return {
				ok: true,
				reply: content,
				suggestions: generateContextualSuggestions(content, context)
			};
		}
	} catch (modelErr) {
		console.warn(`[askAdvisor] Fallback ${model} failed:`, modelErr);
	}
	return {
		ok: true,
		reply: generateLocalAdvisorResponse(messages[messages.length - 1]?.content || "", context),
		suggestions: [
			"🔥 What are the best ideas right now?",
			"💰 Show high MRR SaaS to flank",
			"⚡ How do I push an idea to Project Manage?"
		]
	};
}
function generateContextualSuggestions(reply, context) {
	const suggestions = [];
	const lower = reply.toLowerCase();
	if (context?.name) {
		suggestions.push(`How do I build ${context.name}?`);
		suggestions.push(`What is the monetization model for this?`);
		suggestions.push(`Push this idea to Project Manage`);
		return suggestions.slice(0, 3);
	}
	if (lower.includes("micro-crm") || lower.includes("crm")) suggestions.push("How do I build the Freelance Micro-CRM?");
	if (lower.includes("calorie") || lower.includes("mobile")) suggestions.push("What tech stack is best for mobile offline apps?");
	if (lower.includes("typeframes") || lower.includes("video")) suggestions.push("Tell me about the Typeframes video flank");
	suggestions.push("Which idea has the fastest MVP timeline?");
	suggestions.push("Show me high MRR SaaS opportunities");
	suggestions.push("How do I push an idea to Project Manage?");
	return Array.from(new Set(suggestions)).slice(0, 3);
}
function generateLocalAdvisorResponse(query, context) {
	const q = query.toLowerCase();
	if (context?.name) return `### Opportunities for **${context.name}**\n\nYou're viewing **${context.name}** (${context.category || "Software"}). Here is the breakdown from Finder's intelligence engine:\n\n- **The Market Wedge**: Focus on the core friction in existing solutions. Avoid bloated dashboards and offer a zero-friction first run.\n- **Recommended Tech Stack**: TanStack Start or Next.js, Tailwind CSS, SQLite/Turso or Supabase, and Stripe for payments.\n- **Next Step**: Click the **Push to Project Manage** button above to load this project with an 817-task launch checklist and sequenced vibe prompts!`;
	if (q.includes("best") || q.includes("recommend") || q.includes("solo")) return "### Top Recommended Ideas for Solo Builders on Finder:\n\n1. **[Freelance Micro-CRM](/hit/reddit/freelance-crm)** (Reddit Demand)\n   - **Why It's Great**: High demand from freelancers exhausted by complex enterprise CRMs like HubSpot. A clean, single-page client pipeline.\n   - **MVP Timeline**: 1-2 weeks.\n\n2. **[Offline Calorie & Macro Tracker](/hit/appstore/calorie-counter)** (App Store 1-Star Flank)\n   - **Why It's Great**: Angry 1-star reviews on MyFitnessPal complain about $80/yr paywalls and invasive ads. A pure offline, pay-once app wins immediately.\n   - **Monetization**: One-time purchase ($9.99).\n\n3. **[Typeframes Flank: Automated Screen Recorder](/hit/trustmrr/typeframes)** (TrustMRR: $15.8k MRR)\n   - **Why It's Great**: Fast automated zoom demos for SaaS builders. Proven willingness to pay in the video space.\n\n*Tip: Click any idea link above to view the full 27-section Master Blueprint!*";
	if (q.includes("mobile") || q.includes("app store") || q.includes("play store") || q.includes("ios") || q.includes("android")) return "### Top Mobile App Opportunities on Finder:\n\n- **[Offline Calorie & Macro Tracker](/hit/appstore/calorie-counter)**: Zero subscription, local-first nutritional diary.\n- **[Simple Expense Splitter](/hit/playstore/expense-manager)**: Clean Android expense tracker that doesn't demand cloud login.\n- **[Distraction-Free Habit Tracker](/hit/appstore/habit-streak)**: Minimalist daily checklist beating gamified bloated habit apps.\n\nAll of these are mined directly from angry 1-star reviews on high-download store apps.";
	if (q.includes("saas") || q.includes("mrr") || q.includes("revenue") || q.includes("money")) return "### Top Validated Revenue SaaS to Beat on Finder:\n\n- **[ScreenshotOne](/hit/trustmrr/screenshotone)**: Generating **$27.2k MRR**. Build an edge-rendering screenshot and open-graph generation API.\n- **[Typeframes](/hit/trustmrr/typeframes)**: Generating **$15.8k MRR**. Short-form video generator for SaaS release notes.\n- **[Postiz](/hit/trustmrr/postiz)**: Generating **$14.1k MRR**. Social media scheduling tool with open flanks in creator analytics.\n- **[Chatsimple](/hit/trustmrr/chatsimple)**: Generating **$42.5k MRR**. AI chat agent for inbound lead capture.\n\nYou can inspect each startup's revenue trajectory, verified proof, and customer flanks by clicking their link!";
	if (q.includes("push") || q.includes("project manage") || q.includes("build")) return "### Linking Finder with Project Manage:\n\nFinder and **Project Manage** are linked together to turn validated ideas into real products:\n\n1. Find any idea you want to build on Finder.\n2. Click the **\"Push to Project Manage\"** button on the idea page or card.\n3. Your idea is automatically synced to the shared Turso database and opens in **Project Manage** with:\n   - The **817-Task Master Launch Checklist**.\n   - Your **sequenced vibe coding prompts**.\n   - Real-time status tracking (Idea -> Working -> Done -> Deployed).";
	return "### Welcome to Finder AI Advisor!\n\nI am your startup intelligence advisor, grounded in all **13 Opportunity Desks** on Finder. I can help you with:\n\n- **Discovering App Ideas**: What people are asking for on Reddit, Product Hunt, Twitter, and App Stores.\n- **Evaluating Revenue Startups**: Real MRR numbers, growth rates, and market flanks from TrustMRR.\n- **Picking the Best Idea**: Helping solo developers choose a winnable, high-margin wedge.\n- **Build Blueprints**: Technical stacks, MVP scope, and exporting to Project Manage.\n\n*What kind of product do you want to build (SaaS, Mobile, Developer Tool, Micro-App)?*";
}
var complaintSchema = object({
	theme: string(),
	severity: _enum([
		"critical",
		"high",
		"medium"
	]),
	quote: string(),
	source: string(),
	sourced: boolean(),
	howToFix: string()
});
var stepSchema = object({
	step: number(),
	title: string(),
	why: string(),
	prompt: string(),
	doneWhen: string()
});
var briefSchema = object({
	productName: string(),
	slug: string(),
	thesis: string(),
	opportunity: object({
		betterName: string(),
		positioning: string(),
		whoItsFor: string(),
		whyNow: string()
	}),
	complaints: array(complaintSchema).min(1).max(8),
	gaps: array(string()).max(8),
	vibeGuide: array(stepSchema).min(5).max(10),
	stack: object({
		recommendation: string(),
		reason: string(),
		pieces: array(string()).max(10)
	}),
	mvpScope: array(string()).max(10),
	outOfScope: array(string()).max(8),
	launch: object({
		firstUsers: string(),
		pricing: string(),
		differentiator: string()
	})
});
var SYSTEM = `You are Riposte, a sharp product strategist for indie builders who vibe-code.
You hunt products that already make money or already have demand, read the real complaints (or the Reddit ask), and write a build plan that beats the original by fixing those complaints.

Rules:
- Never invent fake customer quotes. If a quote is real, set sourced=true and name the source (Product Hunt, Reddit, G2, Trustpilot, App Store, Play Store, X, a blog). If you inferred the pain from the product itself, set sourced=false and make quote a paraphrase labeled as inferred.
- Prefer specific, operational complaints (billing, onboarding, accuracy, support, missing feature, ads, crashes) over vague "it's expensive".
- The vibe-code guide can be short placeholders; it will be expanded locally. Focus on thesis, opportunity, complaints (with real quotes), gaps, stack, mvp, launch.
- Recommend a modern vibe-code stack (TanStack Start or Next.js, Tailwind, Postgres, Stripe) unless the category demands native mobile — then Expo.
- The better product must be shippable as an MVP in 1–2 weeks by one person. Cut ruthlessly.
- For Reddit demand, the thread IS the spec. Do not invent a different product.
- Return ONLY valid JSON matching the schema. No markdown fences.`;
var grokBlockedUntil = 0;
function grokIsBlocked() {
	return Date.now() < grokBlockedUntil;
}
function blockGrok(ms) {
	grokBlockedUntil = Date.now() + ms;
}
function isUnavailableError(message) {
	return /out of credits|subscription|quota|insufficient|403|401|invalid api key|not available/i.test(message);
}
function extractOutputText(body) {
	if (!body || typeof body !== "object") return "";
	const rec = body;
	if (typeof rec.output_text === "string") return rec.output_text;
	if (Array.isArray(rec.output)) {
		const texts = [];
		for (const item of rec.output) {
			if (!item || typeof item !== "object") continue;
			const node = item;
			if (typeof node.content === "string") texts.push(node.content);
			if (Array.isArray(node.content)) for (const c of node.content) {
				if (!c || typeof c !== "object") continue;
				const chunk = c;
				if (typeof chunk.text === "string") texts.push(chunk.text);
			}
		}
		if (texts.length) return texts.join("\n");
	}
	const content = rec.choices?.[0]?.message?.content;
	if (typeof content === "string") return content;
	if (Array.isArray(content)) return content.map((c) => typeof c === "object" && c && "text" in c ? String(c.text) : "").join("\n");
	return "";
}
function parseJsonLoose(text) {
	const trimmed = text.trim();
	const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const candidate = fence ? fence[1].trim() : trimmed;
	const start = candidate.indexOf("{");
	const end = candidate.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("The model did not return a plan.");
	return JSON.parse(candidate.slice(start, end + 1));
}
function apiErrorMessage(status, body) {
	if (body && typeof body === "object") {
		const rec = body;
		if (typeof rec.error === "string" && rec.error.trim()) return rec.error;
		const nested = rec.error;
		if (nested && typeof nested.message === "string" && nested.message.trim()) return nested.message;
		if (typeof rec.message === "string" && rec.message.trim()) return rec.message;
	}
	return `xAI API error ${status}`;
}
async function parseBody(res) {
	const text = await res.text();
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return { message: text.slice(0, 280) };
	}
}
async function callChat(apiKey, user) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: user
			}],
			response_format: { type: "json_object" },
			max_completion_tokens: 4500,
			temperature: .4
		}),
		signal: AbortSignal.timeout(18e3)
	});
	const body = await parseBody(res);
	if (!res.ok) throw new Error(apiErrorMessage(res.status, body));
	return extractOutputText(body);
}
async function generateRiposteBrief(input) {
	const fallback = buildLocalBrief({
		profile: input.profile,
		reviews: input.reddit,
		websiteText: input.websiteText
	});
	const apiKey = processModule.env.XAI_API_KEY;
	if (!apiKey || grokIsBlocked()) return fallback;
	const { profile, reddit, websiteText } = input;
	const insights = Object.entries(profile.insights).map(([k, v]) => `${k}: ${v}`).join("\n");
	const stack = Object.entries(profile.techStack).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n");
	const redditBlock = reddit.length === 0 ? "(none found)" : reddit.map((r) => `- [${r.source}] ${r.title}\n  ${r.url}\n  ${r.body}`).join("\n");
	const user = `Build a Riposte brief for this opportunity.

KIND: ${profile.kind}
SOURCE: ${profile.sourceLabel} — ${profile.sourceUrl}

PRODUCT / ASK
Name: ${profile.name}
Id: ${profile.id}
Website: ${profile.website ?? "unknown"}
Category: ${profile.category ?? "unknown"}
Description: ${profile.description}
Developer: ${profile.developer ?? "unknown"}
Revenue last 30d: $${Math.round(profile.revenue.last30Days)}
MRR: $${Math.round(profile.revenue.mrr)}
Rating: ${profile.rating ?? "n/a"} (${profile.ratingsCount ?? "n/a"} ratings)
Installs: ${profile.installs ?? "n/a"}
Reddit score/comments: ${profile.score ?? "n/a"} / ${profile.comments ?? "n/a"}
On sale: ${profile.onSale ? "yes" : "no"}

INSIGHTS
${insights || "none"}

TECH STACK
${stack || "unknown"}

EXTRA
${Object.entries(profile.extra).map(([k, v]) => `${k}: ${v}`).join("\n") || "none"}

WEBSITE / LISTING TEXT (may be truncated)
${(websiteText || "unavailable").slice(0, 4500)}

PUBLIC REVIEW / THREAD TRACES (may be noisy — ignore unrelated)
${redditBlock}

Write the JSON brief.
productName must be ${JSON.stringify(profile.name)}. slug must be ${JSON.stringify(`${profile.kind}:${profile.id}`)}.`;
	try {
		const text = await callChat(apiKey, user);
		if (!text.trim()) return fallback;
		return attachDetailedPrompts({
			...briefSchema.parse(parseJsonLoose(text)),
			productName: profile.name,
			slug: `${profile.kind}:${profile.id}`,
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			origin: "grok"
		}, profile, reddit);
	} catch (err) {
		if (isUnavailableError(err instanceof Error ? err.message : String(err))) blockGrok(216e5);
		return fallback;
	}
}
var briefCache = /* @__PURE__ */ new Map();
var dossierCache = /* @__PURE__ */ new Map();
var BRIEF_TTL = 18e5;
var DOSSIER_TTL = 72e4;
function cacheKey(kind, id) {
	return `${kind}:${id}`;
}
async function assembleTrust(slug) {
	const profile = fromTrustProfile(await loadStartupProfile(slug));
	const [reviews, websiteText] = await Promise.all([gatherReviews(profile.name, profile.website), fetchWebsiteText(profile.website)]);
	const merged = [...reviewsFromWebsite(websiteText, profile.name, profile.website), ...reviews].slice(0, 12);
	return {
		profile,
		reviews: merged,
		brief: buildLocalBrief({
			profile,
			reviews: merged,
			websiteText
		}),
		websiteText
	};
}
async function assembleHit(kind, id) {
	const key = cacheKey(kind, id);
	const hit = dossierCache.get(key);
	if (hit && Date.now() - hit.at < DOSSIER_TTL) return hit.dossier;
	let dossier;
	if (kind === "trustmrr") dossier = await assembleTrust(id);
	else if (kind === "reddit") {
		const { profile, reviews } = await loadRedditProfile(id);
		dossier = {
			profile,
			reviews,
			brief: buildLocalBrief({
				profile,
				reviews,
				websiteText: profile.description
			}),
			websiteText: profile.description
		};
	} else if (kind === "appstore") {
		const { profile, reviews } = await loadAppStoreProfile(id);
		dossier = {
			profile,
			reviews,
			brief: buildLocalBrief({
				profile,
				reviews,
				websiteText: profile.description
			}),
			websiteText: profile.description
		};
	} else if (kind === "playstore") {
		const { profile, reviews } = await loadPlayStoreProfile(id);
		dossier = {
			profile,
			reviews,
			brief: buildLocalBrief({
				profile,
				reviews,
				websiteText: profile.description
			}),
			websiteText: profile.description
		};
	} else {
		const { profile, reviews } = await loadIdeaProfile(kind, id);
		dossier = {
			profile,
			reviews,
			brief: buildLocalBrief({
				profile,
				reviews,
				websiteText: profile.description
			}),
			websiteText: profile.description
		};
	}
	dossierCache.set(key, {
		at: Date.now(),
		dossier
	});
	return dossier;
}
function parseHitInput(input) {
	const rec = typeof input === "object" && input ? input : {};
	let kind = typeof rec.kind === "string" ? rec.kind : "trustmrr";
	let id = typeof rec.id === "string" ? rec.id : typeof rec.slug === "string" ? rec.slug : "";
	if (kind === "trustmrr") id = id.toLowerCase();
	if (kind === "reddit") id = id.toLowerCase();
	if (!isDeskKind(kind) || !isSafeHitId(kind, id)) throw new Error("Invalid opportunity");
	return {
		kind,
		id
	};
}
var fetchDesk_createServerFn_handler = createServerRpc({
	id: "04c3d6d0e10a09784b571ed427a9ff5e9fe34eb18f0015626b26d47ba3da9e5f",
	name: "fetchDesk",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchDesk.__executeServer(opts));
var fetchDesk = createServerFn({ method: "GET" }).validator((input) => {
	const kind = typeof input === "object" && input && "kind" in input ? String(input.kind) : "";
	if (!isDeskKind(kind) || kind === "trustmrr") throw new Error("Invalid desk");
	return { kind };
}).handler(fetchDesk_createServerFn_handler, async ({ data }) => {
	try {
		if (data.kind === "reddit") return { hits: await loadRedditFeed() };
		if (data.kind === "appstore") return { hits: await loadAppStoreFeed() };
		if (data.kind === "playstore") return { hits: await loadPlayStoreFeed() };
		if (isIdeaKind(data.kind)) return { hits: await loadIdeaFeed(data.kind) };
		return { hits: [] };
	} catch (err) {
		return {
			hits: [],
			error: err instanceof Error ? err.message : `Could not load ${data.kind}`
		};
	}
});
var fetchScout_createServerFn_handler = createServerRpc({
	id: "f7405e2bc1a43414ae7efec36dc3dd0ede3fd1c6cff92ba0376614bc5b55ceab",
	name: "fetchScout",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchScout.__executeServer(opts));
var fetchScout = createServerFn({ method: "GET" }).handler(fetchScout_createServerFn_handler, async () => {
	return loadScoutFeed();
});
var fetchProfile_createServerFn_handler = createServerRpc({
	id: "0094828dcb2d3ee625931b762888f74875e8a91a4dcfad61fe0f7d8106cab7e4",
	name: "fetchProfile",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchProfile.__executeServer(opts));
var fetchProfile = createServerFn({ method: "GET" }).validator((input) => {
	const slug = typeof input === "object" && input && "slug" in input ? String(input.slug) : "";
	if (!isSafeSlug(slug.toLowerCase())) throw new Error("Invalid startup slug");
	return { slug: slug.toLowerCase() };
}).handler(fetchProfile_createServerFn_handler, async ({ data }) => {
	return loadStartupProfile(data.slug);
});
var fetchDossier_createServerFn_handler = createServerRpc({
	id: "cf28209a589924822e2f467e20e24f6a7e304342c4166e7aa01e4bebfb66e0a1",
	name: "fetchDossier",
	filename: "src/lib/server-fns.ts"
}, (opts) => fetchDossier.__executeServer(opts));
var fetchDossier = createServerFn({ method: "GET" }).validator(parseHitInput).handler(fetchDossier_createServerFn_handler, async ({ data }) => {
	return assembleHit(data.kind, data.id);
});
var generateBrief_createServerFn_handler = createServerRpc({
	id: "3097d0316f7f278096020ff21dee3db5372981bf5913b8d0a66b2241d63ad424",
	name: "generateBrief",
	filename: "src/lib/server-fns.ts"
}, (opts) => generateBrief.__executeServer(opts));
var generateBrief = createServerFn({ method: "GET" }).validator(parseHitInput).handler(generateBrief_createServerFn_handler, async ({ data }) => {
	try {
		const dossier = await assembleHit(data.kind, data.id);
		const key = cacheKey(data.kind, data.id);
		const cached = briefCache.get(key);
		if (cached && cached.brief.origin === "grok" && Date.now() - cached.at < BRIEF_TTL) return {
			ok: true,
			brief: cached.brief,
			profile: dossier.profile
		};
		const brief = await generateRiposteBrief({
			profile: dossier.profile,
			reddit: dossier.reviews,
			websiteText: dossier.websiteText
		});
		if (brief.origin === "grok") briefCache.set(key, {
			at: Date.now(),
			brief
		});
		return {
			ok: true,
			brief,
			profile: dossier.profile,
			warning: brief.origin === "grok" ? void 0 : "Grok was busy, so this plan is built from the public traces."
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not generate a plan",
			profile: null
		};
	}
});
var pushToProjectManage_createServerFn_handler = createServerRpc({
	id: "f9f6f1020f739df08e8d0144ce0f575c99d7e08a3509f86fce216fd589295b71",
	name: "pushToProjectManage",
	filename: "src/lib/server-fns.ts"
}, (opts) => pushToProjectManage.__executeServer(opts));
var pushToProjectManage = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Invalid payload");
	const r = input;
	return {
		id: typeof r.id === "string" ? r.id : void 0,
		name: typeof r.name === "string" ? r.name : "Untitled Idea",
		description: typeof r.description === "string" ? r.description : "",
		url: typeof r.url === "string" ? r.url : void 0,
		tag: typeof r.tag === "string" ? r.tag : void 0,
		status: typeof r.status === "string" ? r.status : void 0,
		source: typeof r.source === "string" ? r.source : void 0,
		sourceUrl: typeof r.sourceUrl === "string" ? r.sourceUrl : void 0,
		thesis: typeof r.thesis === "string" ? r.thesis : void 0,
		betterName: typeof r.betterName === "string" ? r.betterName : void 0,
		blueprint: typeof r.blueprint === "string" ? r.blueprint : void 0,
		vibeGuide: Array.isArray(r.vibeGuide) ? r.vibeGuide : void 0
	};
}).handler(pushToProjectManage_createServerFn_handler, async ({ data }) => {
	return pushIdeaToProjectHub(data);
});
var chatWithAdvisor_createServerFn_handler = createServerRpc({
	id: "c3da6dc01513fbf2f7e0ffc1a64e27d96827fd8ba06c83a484fada19274db2b3",
	name: "chatWithAdvisor",
	filename: "src/lib/server-fns.ts"
}, (opts) => chatWithAdvisor.__executeServer(opts));
var chatWithAdvisor = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Invalid payload");
	const r = input;
	const messages = (Array.isArray(r.messages) ? r.messages : []).map((m) => ({
		role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
		content: String(m.content || "").slice(0, 3e3)
	}));
	const rawCtx = r.context;
	return {
		messages,
		context: rawCtx ? {
			id: typeof rawCtx.id === "string" ? rawCtx.id : void 0,
			kind: typeof rawCtx.kind === "string" ? rawCtx.kind : void 0,
			name: typeof rawCtx.name === "string" ? rawCtx.name : void 0,
			description: typeof rawCtx.description === "string" ? rawCtx.description : void 0,
			tag: typeof rawCtx.tag === "string" ? rawCtx.tag : void 0,
			category: typeof rawCtx.category === "string" ? rawCtx.category : void 0,
			mrr: typeof rawCtx.mrr === "number" ? rawCtx.mrr : void 0,
			url: typeof rawCtx.url === "string" ? rawCtx.url : void 0
		} : void 0
	};
}).handler(chatWithAdvisor_createServerFn_handler, async ({ data }) => {
	return askAdvisor(data.messages, data.context);
});
//#endregion
export { chatWithAdvisor_createServerFn_handler, fetchDesk_createServerFn_handler, fetchDossier_createServerFn_handler, fetchProfile_createServerFn_handler, fetchScout_createServerFn_handler, generateBrief_createServerFn_handler, pushToProjectManage_createServerFn_handler };
