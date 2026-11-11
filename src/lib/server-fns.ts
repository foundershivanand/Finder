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
import { pushIdeaToProjectHub, type PushToHubInput, type PushToHubResult } from "./project-hub.server";
import { askAdvisor, type ChatAdvisorResult, type ChatMessage, type CurrentIdeaContext } from "./advisor-chat.server";
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
  const kind = typeof rec.kind === "string" ? (rec.kind as DeskKind) : "trustmrr";
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

export const pushToProjectManage = createServerFn({ method: "POST" })
  .validator((input: unknown): PushToHubInput => {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid payload");
    }
    const r = input as Record<string, unknown>;
    return {
      id: typeof r.id === "string" ? r.id : undefined,
      name: typeof r.name === "string" ? r.name : "Untitled Idea",
      description: typeof r.description === "string" ? r.description : "",
      url: typeof r.url === "string" ? r.url : undefined,
      tag: typeof r.tag === "string" ? r.tag : undefined,
      status: typeof r.status === "string" ? r.status : undefined,
      source: typeof r.source === "string" ? r.source : undefined,
      sourceUrl: typeof r.sourceUrl === "string" ? r.sourceUrl : undefined,
      thesis: typeof r.thesis === "string" ? r.thesis : undefined,
      betterName: typeof r.betterName === "string" ? r.betterName : undefined,
      blueprint: typeof r.blueprint === "string" ? r.blueprint : undefined,
      vibeGuide: Array.isArray(r.vibeGuide) ? (r.vibeGuide as PushToHubInput["vibeGuide"]) : undefined,
    };
  })
  .handler(async ({ data }): Promise<PushToHubResult> => {
    return pushIdeaToProjectHub(data);
  });

export const chatWithAdvisor = createServerFn({ method: "POST" })
  .validator((input: unknown): { messages: ChatMessage[]; context?: CurrentIdeaContext; clientId: string } => {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid payload");
    }
    const r = input as Record<string, unknown>;
    const rawMsgs = Array.isArray(r.messages) ? r.messages : [];
    const messages: ChatMessage[] = rawMsgs.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
      content: String(m.content || "").slice(0, 3000),
    }));

    const rawCtx = r.context as Record<string, unknown> | undefined;
    const context: CurrentIdeaContext | undefined = rawCtx
      ? {
          id: typeof rawCtx.id === "string" ? rawCtx.id : undefined,
          kind: typeof rawCtx.kind === "string" ? rawCtx.kind : undefined,
          name: typeof rawCtx.name === "string" ? rawCtx.name : undefined,
          description: typeof rawCtx.description === "string" ? rawCtx.description : undefined,
          tag: typeof rawCtx.tag === "string" ? rawCtx.tag : undefined,
          category: typeof rawCtx.category === "string" ? rawCtx.category : undefined,
          mrr: typeof rawCtx.mrr === "number" ? rawCtx.mrr : undefined,
          url: typeof rawCtx.url === "string" ? rawCtx.url : undefined,
        }
      : undefined;

    const clientId = typeof r.clientId === "string" ? r.clientId.slice(0, 80) : "default";

    return { messages, context, clientId };
  })
  .handler(async ({ data }): Promise<ChatAdvisorResult> => {
    return askAdvisor(data.messages, data.context, data.clientId);
  });


