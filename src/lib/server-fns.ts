import { createServerFn } from "@tanstack/react-start";
import { loadAppStoreFeed, loadAppStoreProfile } from "./appstore.server";
import { isDeskKind, isSafeHitId, isSafeSlug } from "./format";
import { isIdeaKind, loadIdeaFeed, loadIdeaProfile } from "./ideas.server";
import { buildLocalBrief } from "./local-brief";
import { loadPlayStoreFeed, loadPlayStoreProfile } from "./playstore.server";
import { fromTrustProfile } from "./profile";
import { loadRedditFeed, loadRedditProfile } from "./reddit.server";
import { fetchWebsiteText, gatherReviews, reviewsFromWebsite } from "./reviews.server";
import { loadScoutFeed, loadStartupProfile } from "./trustmrr.server";
import type { DeskKind, GenerateResult, ProductDossier, RiposteBrief, ScoutHit } from "./types";
import { generateRiposteBrief } from "./xai.server";

const briefCache = new Map<string, { at: number; brief: RiposteBrief }>();
const dossierCache = new Map<string, { at: number; dossier: ProductDossier }>();
const BRIEF_TTL = 30 * 60_000;
const DOSSIER_TTL = 12 * 60_000;

function cacheKey(kind: DeskKind, id: string) {
  return `${kind}:${id}`;
}

async function assembleTrust(slug: string): Promise<ProductDossier> {
  const raw = await loadStartupProfile(slug);
  const profile = fromTrustProfile(raw);
  const [reviews, websiteText] = await Promise.all([
    gatherReviews(profile.name, profile.website),
    fetchWebsiteText(profile.website),
  ]);
  const siteReviews = reviewsFromWebsite(websiteText, profile.name, profile.website);
  const merged = [...siteReviews, ...reviews].slice(0, 12);
  const brief = buildLocalBrief({ profile, reviews: merged, websiteText });
  return { profile, reviews: merged, brief, websiteText };
}

async function assembleHit(kind: DeskKind, id: string): Promise<ProductDossier> {
  const key = cacheKey(kind, id);
  const hit = dossierCache.get(key);
  if (hit && Date.now() - hit.at < DOSSIER_TTL) return hit.dossier;

  let dossier: ProductDossier;
  if (kind === "trustmrr") {
    dossier = await assembleTrust(id);
  } else if (kind === "reddit") {
    const { profile, reviews } = await loadRedditProfile(id);
    const brief = buildLocalBrief({ profile, reviews, websiteText: profile.description });
    dossier = { profile, reviews, brief, websiteText: profile.description };
  } else if (kind === "appstore") {
    const { profile, reviews } = await loadAppStoreProfile(id);
    const brief = buildLocalBrief({ profile, reviews, websiteText: profile.description });
    dossier = { profile, reviews, brief, websiteText: profile.description };
  } else if (kind === "playstore") {
    const { profile, reviews } = await loadPlayStoreProfile(id);
    const brief = buildLocalBrief({ profile, reviews, websiteText: profile.description });
    dossier = { profile, reviews, brief, websiteText: profile.description };
  } else {
    const { profile, reviews } = await loadIdeaProfile(kind, id);
    const brief = buildLocalBrief({ profile, reviews, websiteText: profile.description });
    dossier = { profile, reviews, brief, websiteText: profile.description };
  }

  dossierCache.set(key, { at: Date.now(), dossier });
  return dossier;
}

function parseHitInput(input: unknown): { kind: DeskKind; id: string } {
  const rec = typeof input === "object" && input ? (input as { kind?: unknown; id?: unknown; slug?: unknown }) : {};
  let kind = typeof rec.kind === "string" ? rec.kind : "trustmrr";
  let id = typeof rec.id === "string" ? rec.id : typeof rec.slug === "string" ? rec.slug : "";
  if (kind === "trustmrr") id = id.toLowerCase();
  if (kind === "reddit") id = id.toLowerCase();
  if (!isDeskKind(kind) || !isSafeHitId(kind, id)) throw new Error("Invalid opportunity");
  return { kind, id };
}

export const fetchDesk = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const kind = typeof input === "object" && input && "kind" in input ? String((input as { kind: unknown }).kind) : "";
    if (!isDeskKind(kind) || kind === "trustmrr") throw new Error("Invalid desk");
    return { kind };
  })
  .handler(async ({ data }): Promise<{ hits: ScoutHit[]; error?: string }> => {
    try {
      if (data.kind === "reddit") return { hits: await loadRedditFeed() };
      if (data.kind === "appstore") return { hits: await loadAppStoreFeed() };
      if (data.kind === "playstore") return { hits: await loadPlayStoreFeed() };
      if (isIdeaKind(data.kind)) return { hits: await loadIdeaFeed(data.kind) };
      return { hits: [] };
    } catch (err) {
      const message = err instanceof Error ? err.message : `Could not load ${data.kind}`;
      return { hits: [], error: message };
    }
  });


export const fetchScout = createServerFn({ method: "GET" }).handler(async () => {
  return loadScoutFeed();
});

export const fetchProfile = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const slug = typeof input === "object" && input && "slug" in input ? String((input as { slug: unknown }).slug) : "";
    if (!isSafeSlug(slug.toLowerCase())) throw new Error("Invalid startup slug");
    return { slug: slug.toLowerCase() };
  })
  .handler(async ({ data }) => {
    return loadStartupProfile(data.slug);
  });

export const fetchDossier = createServerFn({ method: "GET" })
  .validator(parseHitInput)
  .handler(async ({ data }): Promise<ProductDossier> => {
    return assembleHit(data.kind, data.id);
  });

export const generateBrief = createServerFn({ method: "GET" })
  .validator(parseHitInput)
  .handler(async ({ data }): Promise<GenerateResult> => {
    try {
      const dossier = await assembleHit(data.kind, data.id);
      const key = cacheKey(data.kind, data.id);
      const cached = briefCache.get(key);
      if (cached && cached.brief.origin === "grok" && Date.now() - cached.at < BRIEF_TTL) {
        return { ok: true, brief: cached.brief, profile: dossier.profile };
      }
      const brief = await generateRiposteBrief({
        profile: dossier.profile,
        reddit: dossier.reviews,
        websiteText: dossier.websiteText,
      });
      if (brief.origin === "grok") briefCache.set(key, { at: Date.now(), brief });
      return {
        ok: true,
        brief,
        profile: dossier.profile,
        warning: brief.origin === "grok" ? undefined : "Grok was busy, so this plan is built from the public traces.",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not generate a plan";
      return { ok: false, error: message, profile: null };
    }
  });
