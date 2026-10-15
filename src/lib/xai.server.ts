import { z } from "zod";
import { buildLocalBrief } from "./local-brief";
import type { RiposteBrief, ReviewSnippet, TargetProfile } from "./types";
import { attachDetailedPrompts } from "./vibe-prompts";

const complaintSchema = z.object({
  theme: z.string(),
  severity: z.enum(["critical", "high", "medium"]),
  quote: z.string(),
  source: z.string(),
  sourced: z.boolean(),
  howToFix: z.string(),
});

const stepSchema = z.object({
  step: z.number(),
  title: z.string(),
  why: z.string(),
  prompt: z.string(),
  doneWhen: z.string(),
});

const briefSchema = z.object({
  productName: z.string(),
  slug: z.string(),
  thesis: z.string(),
  opportunity: z.object({
    betterName: z.string(),
    positioning: z.string(),
    whoItsFor: z.string(),
    whyNow: z.string(),
  }),
  complaints: z.array(complaintSchema).min(1).max(8),
  gaps: z.array(z.string()).max(8),
  vibeGuide: z.array(stepSchema).min(5).max(10),
  stack: z.object({
    recommendation: z.string(),
    reason: z.string(),
    pieces: z.array(z.string()).max(10),
  }),
  mvpScope: z.array(z.string()).max(10),
  outOfScope: z.array(z.string()).max(8),
  launch: z.object({
    firstUsers: z.string(),
    pricing: z.string(),
    differentiator: z.string(),
  }),
});

const SYSTEM = `You are Riposte, a sharp product strategist for indie builders who vibe-code.
You hunt products that already make money or already have demand, read the real complaints (or the Reddit ask), and write a build plan that beats the original by fixing those complaints.

Rules:
- Never invent fake customer quotes. If a quote is real, set sourced=true and name the source (Product Hunt, Reddit, G2, Trustpilot, App Store, Play Store, X, a blog). If you inferred the pain from the product itself, set sourced=false and make quote a paraphrase labeled as inferred.
- Prefer specific, operational complaints (billing, onboarding, accuracy, support, missing feature, ads, crashes) over vague "it's expensive".
- The vibe-code guide can be short placeholders; it will be expanded locally. Focus on thesis, opportunity, complaints (with real quotes), gaps, stack, mvp, launch.
- Recommend a modern vibe-code stack (TanStack Start or Next.js, Tailwind, Postgres, Stripe) unless the category demands native mobile — then Expo.
- The better product must be shippable as an MVP in 1–2 weeks by one person. Cut ruthlessly.
- For Reddit demand, the thread IS the spec. Do not invent a different product.
- Return ONLY valid JSON matching the schema. No markdown fences.`;

let grokBlockedUntil = 0;

function grokIsBlocked(): boolean {
  return Date.now() < grokBlockedUntil;
}

function blockGrok(ms: number) {
  grokBlockedUntil = Date.now() + ms;
}

function isUnavailableError(message: string): boolean {
  return /out of credits|subscription|quota|insufficient|403|401|invalid api key|not available/i.test(
    message,
  );
}

function extractOutputText(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const rec = body as Record<string, unknown>;
  if (typeof rec.output_text === "string") return rec.output_text;
  if (Array.isArray(rec.output)) {
    const texts: string[] = [];
    for (const item of rec.output) {
      if (!item || typeof item !== "object") continue;
      const node = item as Record<string, unknown>;
      if (typeof node.content === "string") texts.push(node.content);
      if (Array.isArray(node.content)) {
        for (const c of node.content) {
          if (!c || typeof c !== "object") continue;
          const chunk = c as Record<string, unknown>;
          if (typeof chunk.text === "string") texts.push(chunk.text);
        }
      }
    }
    if (texts.length) return texts.join("\n");
  }
  const choices = rec.choices as Array<{ message?: { content?: unknown } }> | undefined;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "object" && c && "text" in c ? String((c as { text: unknown }).text) : ""))
      .join("\n");
  }
  return "";
}

function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("The model did not return a plan.");
  return JSON.parse(candidate.slice(start, end + 1));
}

function apiErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === "object") {
    const rec = body as Record<string, unknown>;
    if (typeof rec.error === "string" && rec.error.trim()) return rec.error;
    const nested = rec.error as { message?: unknown } | undefined;
    if (nested && typeof nested.message === "string" && nested.message.trim()) return nested.message;
    if (typeof rec.message === "string" && rec.message.trim()) return rec.message;
  }
  return `xAI API error ${status}`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 280) };
  }
}

async function callChat(apiKey: string, user: string): Promise<string> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4500,
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(18_000),
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(apiErrorMessage(res.status, body));
  return extractOutputText(body);
}

export async function generateRiposteBrief(input: {
  profile: TargetProfile;
  reddit: ReviewSnippet[];
  websiteText: string | null;
}): Promise<RiposteBrief> {
  const fallback = buildLocalBrief({
    profile: input.profile,
    reviews: input.reddit,
    websiteText: input.websiteText,
  });

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey || grokIsBlocked()) return fallback;

  const { profile, reddit, websiteText } = input;
  const insights = Object.entries(profile.insights)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const stack = Object.entries(profile.techStack)
    .map(([k, v]) => `${k}: ${v.join(", ")}`)
    .join("\n");
  const redditBlock =
    reddit.length === 0
      ? "(none found)"
      : reddit.map((r) => `- [${r.source}] ${r.title}\n  ${r.url}\n  ${r.body}`).join("\n");

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
${Object.entries(profile.extra)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n") || "none"}

WEBSITE / LISTING TEXT (may be truncated)
${(websiteText || "unavailable").slice(0, 4500)}

PUBLIC REVIEW / THREAD TRACES (may be noisy — ignore unrelated)
${redditBlock}

Write the JSON brief.
productName must be ${JSON.stringify(profile.name)}. slug must be ${JSON.stringify(`${profile.kind}:${profile.id}`)}.`;

  try {
    const text = await callChat(apiKey, user);
    if (!text.trim()) return fallback;
    const parsed = briefSchema.parse(parseJsonLoose(text));
    const brief: RiposteBrief = {
      ...parsed,
      productName: profile.name,
      slug: `${profile.kind}:${profile.id}`,
      generatedAt: new Date().toISOString(),
      origin: "grok",
    };
    return attachDetailedPrompts(brief, profile, reddit);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isUnavailableError(message)) blockGrok(6 * 60 * 60_000);
    return fallback;
  }
}
