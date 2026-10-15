import { loadScoutFeed } from "./trustmrr.server";
import { loadRedditFeed } from "./reddit.server";
import { loadAppStoreFeed } from "./appstore.server";
import { loadPlayStoreFeed } from "./playstore.server";
import type { DeskKind, ScoutHit, ScoutProduct } from "./types";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CurrentIdeaContext {
  id?: string;
  kind?: string;
  name?: string;
  description?: string;
  tag?: string;
  category?: string;
  mrr?: number;
  url?: string;
}

export interface ChatAdvisorResult {
  ok: boolean;
  reply: string;
  suggestions: string[];
}

const OPENROUTER_DEFAULT_KEY =
  "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";

let catalogSummaryCache: { at: number; summary: string } | null = null;
const CATALOG_TTL = 15 * 60_000;

export async function getFinderCatalogSummary(): Promise<string> {
  if (catalogSummaryCache && Date.now() - catalogSummaryCache.at < CATALOG_TTL) {
    return catalogSummaryCache.summary;
  }

  try {
    const [scoutFeed, redditHits, appStoreHits, playStoreHits] = await Promise.all([
      loadScoutFeed().catch(() => null),
      loadRedditFeed().catch(() => [] as ScoutHit[]),
      loadAppStoreFeed().catch(() => [] as ScoutHit[]),
      loadPlayStoreFeed().catch(() => [] as ScoutHit[]),
    ]);

    const lines: string[] = [];

    lines.push("### 13 OPPORTUNITY DESKS ON FINDER:");
    lines.push(
      "- TrustMRR: Verified MRR, revenue & growth startups with open flanks"
    );
    lines.push(
      "- Reddit: Real unmet requests and problem threads from r/SomebodyMakeThis, r/AppIdeas, r/SaaS"
    );
    lines.push(
      "- App Store: iOS top grossing apps with angry 1-star reviews revealing open market flanks"
    );
    lines.push(
      "- Play Store: Google Play Store hits with UI/UX friction and missing features"
    );
    lines.push(
      "- Twitter / X: Live requests ('I wish there was an app that...') and founder pain points"
    );
    lines.push("- Product Hunt: Daily launches with comment feedback specs");
    lines.push(
      "- Hacker News: Show HN and Ask HN launches with brutal developer critiques"
    );
    lines.push("- GitHub: Trending repos whose issue trackers are product specs");
    lines.push("- BetaList, Lobsters, DEV, Firefox Add-ons, Launching Next");

    if (scoutFeed) {
      lines.push("\n### TOP VALIDATED REVENUE STARTUPS (TrustMRR Desk):");
      const topEarning = (scoutFeed.earning || []).slice(0, 12);
      for (const p of topEarning) {
        const mrrStr = p.revenue.mrr ? `$${Math.round(p.revenue.mrr).toLocaleString()}/mo` : "Verified";
        lines.push(
          `- [${p.name}](/hit/trustmrr/${p.slug}) | ${mrrStr} MRR | Category: ${p.category || "SaaS"} | Flank: ${p.description.slice(0, 160)}`
        );
      }

      const topGrowing = (scoutFeed.growing || []).slice(0, 8);
      lines.push("\n### FASTEST GROWING REVENUE STARTUPS:");
      for (const p of topGrowing) {
        const growthStr = p.growth30d ? `+${p.growth30d}% 30d growth` : "Rapid growth";
        lines.push(
          `- [${p.name}](/hit/trustmrr/${p.slug}) | ${growthStr} | ${p.description.slice(0, 140)}`
        );
      }
    }

    if (redditHits && redditHits.length > 0) {
      lines.push("\n### TOP REDDIT DEMAND REQUESTS (Unmet User Needs):");
      for (const r of redditHits.slice(0, 10)) {
        lines.push(
          `- [${r.name}](/hit/reddit/${r.id}) | Category: ${r.category || "Reddit"} | Problem: ${r.description.slice(0, 160)}`
        );
      }
    }

    if (appStoreHits && appStoreHits.length > 0) {
      lines.push("\n### APP STORE 1-STAR OPPORTUNITIES (iOS Flanks):");
      for (const a of appStoreHits.slice(0, 6)) {
        lines.push(
          `- [${a.name}](/hit/appstore/${a.id}) | Category: ${a.category || "Mobile"} | Flank: ${a.description.slice(0, 150)}`
        );
      }
    }

    if (playStoreHits && playStoreHits.length > 0) {
      lines.push("\n### GOOGLE PLAY 1-STAR OPPORTUNITIES (Android Flanks):");
      for (const g of playStoreHits.slice(0, 6)) {
        lines.push(
          `- [${g.name}](/hit/playstore/${g.id}) | Category: ${g.category || "Android"} | Flank: ${g.description.slice(0, 150)}`
        );
      }
    }

    const summary = lines.join("\n");
    catalogSummaryCache = { at: Date.now(), summary };
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

function buildSystemPrompt(catalog: string, context?: CurrentIdeaContext): string {
  let contextSection = "";
  if (context && context.name) {
    contextSection = `
CURRENT PAGE CONTEXT (User is currently looking at this idea):
- Name: ${context.name}
- Desk: ${context.kind || "Finder"}
- Category: ${context.category || context.tag || "Software"}
- Description: ${context.description || "No description"}
${context.mrr ? `- Verified MRR: $${context.mrr}/mo` : ""}
${context.url ? `- Link: ${context.url}` : ""}
When relevant, reference this current opportunity directly and offer tailored strategic advice!
`;
  }

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
6. OFF-TOPIC RULE: If the user asks about completely unrelated topics (cooking recipes, video games, homework, politics, celebrity gossip), politely decline in 1-2 friendly sentences and pivot back to Finder startup ideas.
7. Tone: Sharp, pragmatic, encouraging, and focused on indie hacker execution. Use bullet points and bold text for readability.`;
}

export async function askAdvisor(
  messages: ChatMessage[],
  context?: CurrentIdeaContext
): Promise<ChatAdvisorResult> {
  const catalog = await getFinderCatalogSummary();
  const systemPrompt = buildSystemPrompt(catalog, context);

  const key =
    process.env.OPENROUTER_API_KEY ||
    process.env.GEMINI_API_KEY ||
    OPENROUTER_DEFAULT_KEY;

  // Prepare messages payload
  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.slice(-8), // keep last 8 messages for context window
  ];

  // Try OpenRouter with Gemini 2.5 Flash first, then Llama 3.1 8B as fallback
  const models = [
    "google/gemini-2.5-flash",
    "meta-llama/llama-3.1-8b-instruct",
  ];

  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "HTTP-Referer": "https://finder-d17.pages.dev",
          "X-Title": "Finder AI Advisor",
        },
        body: JSON.stringify({
          model,
          max_tokens: 850,
          temperature: 0.45,
          messages: apiMessages,
        }),
        signal: AbortSignal.timeout(12_000),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          return {
            ok: true,
            reply: content,
            suggestions: generateContextualSuggestions(content, context),
          };
        }
      } else {
        const errorText = await res.text();
        console.warn(`[askAdvisor] Model ${model} returned ${res.status}:`, errorText.slice(0, 160));
      }
    } catch (modelErr) {
      console.warn(`[askAdvisor] Model ${model} failed:`, modelErr);
    }
  }

  // Graceful local fallback if external AI APIs are blocked or timing out
  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const localReply = generateLocalAdvisorResponse(lastUserMsg, context);

  return {
    ok: true,
    reply: localReply,
    suggestions: [
      "🔥 What are the best ideas right now?",
      "💰 Show high MRR SaaS to flank",
      "⚡ How do I push an idea to Project Manage?",
    ],
  };
}

function generateContextualSuggestions(reply: string, context?: CurrentIdeaContext): string[] {
  const suggestions: string[] = [];
  const lower = reply.toLowerCase();

  if (context?.name) {
    suggestions.push(`How do I build ${context.name}?`);
    suggestions.push(`What is the monetization model for this?`);
    suggestions.push(`Push this idea to Project Manage`);
    return suggestions.slice(0, 3);
  }

  if (lower.includes("micro-crm") || lower.includes("crm")) {
    suggestions.push("How do I build the Freelance Micro-CRM?");
  }
  if (lower.includes("calorie") || lower.includes("mobile")) {
    suggestions.push("What tech stack is best for mobile offline apps?");
  }
  if (lower.includes("typeframes") || lower.includes("video")) {
    suggestions.push("Tell me about the Typeframes video flank");
  }

  suggestions.push("Which idea has the fastest MVP timeline?");
  suggestions.push("Show me high MRR SaaS opportunities");
  suggestions.push("How do I push an idea to Project Manage?");

  return Array.from(new Set(suggestions)).slice(0, 3);
}

function generateLocalAdvisorResponse(query: string, context?: CurrentIdeaContext): string {
  const q = query.toLowerCase();

  if (context?.name) {
    return `### Opportunities for **${context.name}**\n\n` +
      `You're viewing **${context.name}** (${context.category || "Software"}). Here is the breakdown from Finder's intelligence engine:\n\n` +
      `- **The Market Wedge**: Focus on the core friction in existing solutions. Avoid bloated dashboards and offer a zero-friction first run.\n` +
      `- **Recommended Tech Stack**: TanStack Start or Next.js, Tailwind CSS, SQLite/Turso or Supabase, and Stripe for payments.\n` +
      `- **Next Step**: Click the **Push to Project Manage** button above to load this project with an 817-task launch checklist and sequenced vibe prompts!`;
  }

  if (q.includes("best") || q.includes("recommend") || q.includes("solo")) {
    return `### Top Recommended Ideas for Solo Builders on Finder:\n\n` +
      `1. **[Freelance Micro-CRM](/hit/reddit/freelance-crm)** (Reddit Demand)\n` +
      `   - **Why It's Great**: High demand from freelancers exhausted by complex enterprise CRMs like HubSpot. A clean, single-page client pipeline.\n` +
      `   - **MVP Timeline**: 1-2 weeks.\n\n` +
      `2. **[Offline Calorie & Macro Tracker](/hit/appstore/calorie-counter)** (App Store 1-Star Flank)\n` +
      `   - **Why It's Great**: Angry 1-star reviews on MyFitnessPal complain about $80/yr paywalls and invasive ads. A pure offline, pay-once app wins immediately.\n` +
      `   - **Monetization**: One-time purchase ($9.99).\n\n` +
      `3. **[Typeframes Flank: Automated Screen Recorder](/hit/trustmrr/typeframes)** (TrustMRR: $15.8k MRR)\n` +
      `   - **Why It's Great**: Fast automated zoom demos for SaaS builders. Proven willingness to pay in the video space.\n\n` +
      `*Tip: Click any idea link above to view the full 27-section Master Blueprint!*`;
  }

  if (q.includes("mobile") || q.includes("app store") || q.includes("play store") || q.includes("ios") || q.includes("android")) {
    return `### Top Mobile App Opportunities on Finder:\n\n` +
      `- **[Offline Calorie & Macro Tracker](/hit/appstore/calorie-counter)**: Zero subscription, local-first nutritional diary.\n` +
      `- **[Simple Expense Splitter](/hit/playstore/expense-manager)**: Clean Android expense tracker that doesn't demand cloud login.\n` +
      `- **[Distraction-Free Habit Tracker](/hit/appstore/habit-streak)**: Minimalist daily checklist beating gamified bloated habit apps.\n\n` +
      `All of these are mined directly from angry 1-star reviews on high-download store apps.`;
  }

  if (q.includes("saas") || q.includes("mrr") || q.includes("revenue") || q.includes("money")) {
    return `### Top Validated Revenue SaaS to Beat on Finder:\n\n` +
      `- **[ScreenshotOne](/hit/trustmrr/screenshotone)**: Generating **$27.2k MRR**. Build an edge-rendering screenshot and open-graph generation API.\n` +
      `- **[Typeframes](/hit/trustmrr/typeframes)**: Generating **$15.8k MRR**. Short-form video generator for SaaS release notes.\n` +
      `- **[Postiz](/hit/trustmrr/postiz)**: Generating **$14.1k MRR**. Social media scheduling tool with open flanks in creator analytics.\n` +
      `- **[Chatsimple](/hit/trustmrr/chatsimple)**: Generating **$42.5k MRR**. AI chat agent for inbound lead capture.\n\n` +
      `You can inspect each startup's revenue trajectory, verified proof, and customer flanks by clicking their link!`;
  }

  if (q.includes("push") || q.includes("project manage") || q.includes("build")) {
    return `### Linking Finder with Project Manage:\n\n` +
      `Finder and **Project Manage** are linked together to turn validated ideas into real products:\n\n` +
      `1. Find any idea you want to build on Finder.\n` +
      `2. Click the **"Push to Project Manage"** button on the idea page or card.\n` +
      `3. Your idea is automatically synced to the shared Turso database and opens in **Project Manage** with:\n` +
      `   - The **817-Task Master Launch Checklist**.\n` +
      `   - Your **sequenced vibe coding prompts**.\n` +
      `   - Real-time status tracking (Idea -> Working -> Done -> Deployed).`;
  }

  return `### Welcome to Finder AI Advisor!\n\n` +
    `I am your startup intelligence advisor, grounded in all **13 Opportunity Desks** on Finder. I can help you with:\n\n` +
    `- **Discovering App Ideas**: What people are asking for on Reddit, Product Hunt, Twitter, and App Stores.\n` +
    `- **Evaluating Revenue Startups**: Real MRR numbers, growth rates, and market flanks from TrustMRR.\n` +
    `- **Picking the Best Idea**: Helping solo developers choose a winnable, high-margin wedge.\n` +
    `- **Build Blueprints**: Technical stacks, MVP scope, and exporting to Project Manage.\n\n` +
    `*What kind of product do you want to build (SaaS, Mobile, Developer Tool, Micro-App)?*`;
}
