import { hitKey } from "./format";
import type { Complaint, RiposteBrief, ReviewSnippet, TargetProfile } from "./types";
import { attachDetailedPrompts } from "./vibe-prompts";

type Play = {
  theme: string;
  severity: Complaint["severity"];
  quote: string;
  howToFix: string;
  gap: string;
};

function firstMarket(profile: TargetProfile): string {
  return (profile.category || profile.insights.Markets || deskMarket(profile)).split(",")[0]!.replace(/\[|\]/g, "").trim();
}

function deskMarket(profile: TargetProfile): string {
  if (profile.kind === "reddit" || profile.kind === "twitter") return "the thing people are asking for";
  if (profile.kind === "hackernews") return "the HN story";
  if (profile.kind === "appstore") return "iOS app";
  if (profile.kind === "playstore") return "Android app";
  if (profile.kind === "firefox") return "browser add-on";
  if (profile.kind === "github") return "developer tool";
  if (profile.kind === "producthunt" || profile.kind === "betalist" || profile.kind === "launchingnext") return "new launch";
  return "SaaS";
}

function blob(profile: TargetProfile, websiteText: string | null = null): string {
  return [
    profile.name,
    profile.description,
    profile.category,
    profile.kind,
    Object.values(profile.insights).join(" "),
    Object.values(profile.techStack).flat().join(" "),
    Object.values(profile.extra).join(" "),
    websiteText ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function isAskKind(kind: TargetProfile["kind"]) {
  return kind === "reddit" || kind === "twitter" || kind === "hackernews" || kind === "lobsters";
}

function pickName(profile: TargetProfile): string {
  if (isAskKind(profile.kind) || profile.kind === "devto") {
    const t = profile.name.replace(/\.$/, "");
    const named = t.match(/\b(?:called|named|build|make)\s+([A-Z][A-Za-z0-9]+)\b/);
    if (named?.[1] && named[1].length > 3) return named[1];
    const clipped = t
      .replace(/^(somebody make( this)?:?|someone make|i wish there was|looking for)\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();
    const words = clipped.split(" ").slice(0, 3).join(" ");
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
  const base = profile.name.replace(/\s*(AI|App|HQ|Labs|IO|Inc|:.*)\s*$/i, "").trim() || profile.name;
  const short = base.split(/\s+/).slice(0, 2).join(" ");
  return `${short} Clear`.slice(0, 28);
}

function websitePlays(profile: TargetProfile, websiteText: string | null): Play[] {
  if (!websiteText) return [];
  const t = websiteText.toLowerCase();
  const name = profile.name;
  const plays: Play[] = [];
  if (/book a demo|request a demo|talk to sales|contact sales|get a demo/.test(t)) {
    plays.push({
      theme: "Demo-gated self-serve",
      severity: "critical",
      quote: `${name}'s site pushes a demo instead of a first win. People who already pay in this category will not book a calendar slot to find out if it works.`,
      howToFix:
        "Ship a useful free path: sample workspace, one job completed, then a paywall. Demo can exist for enterprise — it cannot be the only door.",
      gap: "Self-serve first win instead of a sales call.",
    });
  }
  if (/waitlist|coming soon|join the wait|get early access/.test(t)) {
    plays.push({
      theme: "Waitlist instead of a product",
      severity: "high",
      quote: `${name} still smells like a landing page. A waitlist in a category that already converts is an invitation to be replaced.`,
      howToFix: "Take the card today. Paid plan live on day one, even if the backend is a spreadsheet for week one.",
      gap: "Pay-today instead of a waitlist.",
    });
  }
  if (/contact (us )?for pricing|custom pricing|enterprise pricing|request a quote/.test(t)) {
    plays.push({
      theme: "Pricing you have to beg for",
      severity: "critical",
      quote: `${name} hides the number. That reads as expensive, and indie buyers bounce before they ever feel the product.`,
      howToFix: "A public /pricing page with a useful free tier, a monthly they can explain out loud, and a cancel that works in two clicks.",
      gap: "A price you can screenshot.",
    });
  }
  if (/no refund|non-refundable|all sales final/.test(t)) {
    plays.push({
      theme: "Refund hostility",
      severity: "high",
      quote: `${name} copy signals you will not get your money back. That is how 1-stars get written even when the product is fine.`,
      howToFix: "7-day refund if they did not complete the first job. Put it on the pricing page, not in a PDF.",
      gap: "A refund window tied to first value, not fine print.",
    });
  }
  return plays;
}

function playbook(profile: TargetProfile, websiteText: string | null): Play[] {
  const b = blob(profile, websiteText);
  const name = profile.name;
  const plays: Play[] = websitePlays(profile, websiteText);

  const add = (p: Play) => {
    if (plays.some((x) => x.theme === p.theme)) return;
    plays.push(p);
  };

  if (isAskKind(profile.kind)) {
    add({
      theme: "Nobody shipped the obvious version",
      severity: "critical",
      quote: `${profile.sourceLabel} is already describing the product. The thread is the spec — incumbents left this on the floor.`,
      howToFix: "Treat the post as acceptance tests. The MVP is the shortest path that makes this exact request feel finished.",
      gap: "A product that matches the ask, not a broader platform.",
    });
    if (/price|cheap|free|afford|subscription/i.test(b)) {
      add({
        theme: "Existing tools price out the asker",
        severity: "high",
        quote: "The thread keeps circling cost. A useful free tier that completes one job will take this room.",
        howToFix: "Ship a free first-win, then a simple monthly. No demo call.",
        gap: "A price a Reddit thread would actually pay.",
      });
    }
  }

  if (profile.kind === "appstore" || profile.kind === "playstore") {
    add({
      theme: "Store 1-stars cluster on the same three things",
      severity: "critical",
      quote: `${name} is charting, which means demand is real. The 1-stars are a punch list: ads, crashes, account traps, paywalls that lie.`,
      howToFix:
        "Read the last fifty 1-stars as a backlog. Pick the two themes with the most blood and make them structurally impossible in the clone.",
      gap: "A charting category with a cleaner first week.",
    });
    if (/ad|paywall|premium|subscription/.test(b)) {
      add({
        theme: "Ads and a hostile paywall",
        severity: "high",
        quote: `Store reviews punish ${name} when the free path is unusable and cancel is a maze.`,
        howToFix: "One honest free job, then a single monthly. Cancel in two taps. Ads never interrupt the core loop.",
        gap: "A free path that still feels like the product.",
      });
    }
  }

  if (/lead gen|prospect|outreach|scrape|google maps/.test(b) || (/\bb2b\b/.test(b) && /lead|prospect/.test(b))) {
    add({
      theme: "Stale leads and junk rows",
      severity: "critical",
      quote: `Lead tools like ${name} die when the first 20 rows bounce. Buyers do not forgive a CSV of closed shops and generic emails.`,
      howToFix:
        "Every row gets last-verified, a bounce webhook, and a 'why this lead' snippet. Reject empty emails before the user exports.",
      gap: "Verified, explainable leads — not a scrape dump.",
    });
    add({
      theme: "Outreach that burns the domain",
      severity: "high",
      quote: `${name} users will torch their sending domain if the product hands them a spray-and-pray sequence with no warmup or personalization.`,
      howToFix:
        "Default to 15 highly personalized emails, not 500. Show spam-risk before send. Connect to an existing mailbox rather than a mystery SMTP.",
      gap: "Safe, small-batch outreach as the default.",
    });
  }

  if (/linkedin|schedule content/.test(b)) {
    add({
      theme: "Vanity engagement, no pipeline",
      severity: "high",
      quote: `Social tools like ${name} get cancelled when likes do not become conversations or customers.`,
      howToFix:
        "Make the home screen replies, DMs, and 'people who engaged twice' — not a calendar of posts. Queue is secondary to inbox.",
      gap: "An engagement inbox that is the product.",
    });
  }

  if (/faceless|youtube|tiktok|content production|reel|ugc/.test(b)) {
    add({
      theme: "Volume without a voice",
      severity: "critical",
      quote: `Buyers of ${name} are scared the output is interchangeable sludge that platforms bury and clients reject.`,
      howToFix:
        "Force a brand kit (voice, banned phrases, 3 reference links) before generate. Show a 'why this script' trace. One revision included.",
      gap: "Brand-locked drafts with a visible edit pass.",
    });
  }

  if (/\b(llm gateway|api gateway|model router|openai proxy)\b/.test(b) || /ai[- ]?(agent|gateway|wrapper)(?!s)/.test(b)) {
    add({
      theme: "Usage and cost opacity",
      severity: "critical",
      quote: `People buying ${name} cannot see, in one screen, which model ate the budget. API gateways that hide unit economics get churned the week a bill spikes.`,
      howToFix:
        "Make a live usage ledger the home screen: tokens, cost, model, latency per request, with hard caps and Slack/email alerts before the card is charged.",
      gap: "A billing cockpit that is the product, not a settings afterthought.",
    });
    add({
      theme: "Model lag and silent fallbacks",
      severity: "high",
      quote: `If ${name} routes to a stale model or fails over without saying so, developers ship the wrong quality bar and blame the wrapper.`,
      howToFix:
        "Expose the resolved model, region, and fallback chain on every response header and in the dashboard. Let the user pin versions.",
      gap: "Pinned model versions with visible fallback policy.",
    });
  }

  if (/seo|article|writer|blog/.test(b) && !/faceless|youtube|tiktok|reel/.test(b)) {
    add({
      theme: "Generic AI copy that tanks rankings",
      severity: "critical",
      quote: `Buyers of ${name} are scared the output is indistinguishable sludge that Google or clients will reject.`,
      howToFix:
        "Force source-backed drafts: outline from crawled URLs, quote extraction, and a 'human edit' pass with change-tracking before publish.",
      gap: "Citation-backed drafts instead of raw autocomplete.",
    });
  }

  if (/video|reel|avatar/.test(b)) {
    add({
      theme: "Render queue and quality drift",
      severity: "high",
      quote: `${name} will lose users the first time a reel comes back late, watermarked, or with mismatched lipsync.`,
      howToFix:
        "Show a honest queue with ETA, allow 1 free rerender, and preview the first 3 seconds before burning credits.",
      gap: "Transparent queue + first-seconds preview before spend.",
    });
  }

  if (/course|learn|tutor/.test(b)) {
    add({
      theme: "Stale curriculum, no proof of outcome",
      severity: "high",
      quote: `Courses like ${name} die when the stack they teach has moved on and there is no project a student can show.`,
      howToFix:
        "Ship a living syllabus with dated modules and a capstone the student publishes. Refund window tied to finishing lesson 1, not fine print.",
      gap: "Dated modules plus a public capstone.",
    });
  }

  if (/\b(directory|directories|affiliate list|lead list)\b/.test(b)) {
    add({
      theme: "Stale records and thin coverage",
      severity: "critical",
      quote: `A directory is only as good as last-verified dates. ${name} buyers bounce when they hit dead emails or missing niches.`,
      howToFix:
        "Every row gets a last-verified stamp, bounce webhook, and 'request a niche' that actually emails the founder.",
      gap: "Verification dates on every record, not a static CSV.",
    });
  }

  if (/widget|embed|extension/.test(b)) {
    add({
      theme: "Install friction and permission fear",
      severity: "high",
      quote: `Embeds and extensions lose the tab if install takes more than one paste or asks for spooky permissions.`,
      howToFix:
        "One script tag, visible sandbox, and a live playground on the marketing site that uses the same snippet.",
      gap: "Copy-paste install with a live playground.",
    });
  }

  if (/\b(roommate|roommates)\b/.test(blob(profile)) || /\b(dating app|dating marketplace)\b/.test(blob(profile))) {
    add({
      theme: "Trust and empty-city cold start",
      severity: "critical",
      quote: `Marketplaces like ${name} feel dead in any city without density, and people will not pay to talk to ghosts.`,
      howToFix:
        "Launch city-by-city with a concierge matching the first 50 users by hand, then open self-serve. Verified photos and a report flow from day one.",
      gap: "Concierge density before self-serve fees.",
    });
  }

  add({
    theme: "Onboarding that assumes too much",
    severity: "high",
    quote: `Most ${name} signups will not read the docs. If the first session is not a win in under three minutes, they churn and write the 1-star.`,
    howToFix:
      "A single happy-path checklist: sample data already loaded, one obvious primary button, and a 90-second empty-state tour that does the first job for them.",
    gap: "A three-minute first win with sample data.",
  });

  add({
    theme: "Pricing that feels like a trap",
    severity: "high",
    quote: `${name} will get roasted if plans hide limits, annual-only discounts, or usage that is impossible to forecast.`,
    howToFix:
      "Publish a public pricing page with a usage estimator, a visible free tier that is actually useful, and no dark patterns on cancel.",
    gap: "Honest estimator and a useful free tier.",
  });

  add({
    theme: "Support disappears after the charge",
    severity: "medium",
    quote: `Indie tools get 1-stars for silence. If ${name} is a solo shop, buyers assume they will be stranded.`,
    howToFix:
      "In-app inbox with a 1-business-day SLA, a public changelog, and a status page. Even a Linear-backed form beats a hidden email.",
    gap: "In-app support with a public changelog.",
  });

  if (profile.onSale) {
    add({
      theme: "For-sale stigma",
      severity: "critical",
      quote: `${name} is listed for sale. Buyers read that as 'the founder is leaving' and will not build a workflow on it.`,
      howToFix:
        "Your rival should be operator-owned: say who ships, show a 30-day commit log, and offer an escrowed annual plan.",
      gap: "Visible operator + commit log as trust.",
    });
  }

  if (profile.github && profile.github.connected && profile.github.contrib30 <= 1) {
    add({
      theme: "Quiet repo, quiet product",
      severity: "medium",
      quote: `${name} shows almost no shipping in the last 30 days. Developers treat that as abandonware even when revenue is fine.`,
      howToFix:
        "A public changelog fed by real merges, and a weekly shipping note on the homepage. Rhythm is the feature.",
      gap: "Weekly shipping note tied to real commits.",
    });
  }

  if (profile.domainRating != null && profile.domainRating < 10) {
    add({
      theme: "No one can find it",
      severity: "medium",
      quote: `${name} has weak domain authority. People who would pay cannot discover it outside screenshots.`,
      howToFix:
        "Ship comparison pages against the two obvious incumbents, a public template gallery, and one genuinely useful free tool for inbound.",
      gap: "Comparison pages and a free inbound tool.",
    });
  }

  if (profile.estimatedUsers && /^0\b/.test(profile.estimatedUsers.trim())) {
    add({
      theme: "Empty-room social proof",
      severity: "high",
      quote: `${name} lists ~0 users. Even with revenue, the site will feel like a ghost town unless you manufacture proof carefully.`,
      howToFix:
        "Lead with verified revenue and 3 named case snippets, not fake logos. A live counter of jobs done this week beats a testimonial wall.",
      gap: "Live 'jobs done' counter instead of fake logos.",
    });
  }

  return plays;
}

function fromReviews(reviews: ReviewSnippet[], name: string): Complaint[] {
  const out: Complaint[] = [];
  for (const r of reviews) {
    if (out.length >= 4) break;
    const body = r.body.replace(/\s+/g, " ").trim();
    if (body.length < 40) continue;
    const theme = /pric|bill|expens|cost|refund|paywall|ads?\b/i.test(body)
      ? "Pricing, ads, and refunds"
      : /slow|latency|down|outage|crash/i.test(body)
        ? "Reliability"
        : /support|reply|response|ban/i.test(body)
          ? "Support silence"
          : /bug|broken|crash|error/i.test(body)
            ? "Bugs in the core loop"
            : /confus|onboard|ui|ux|docs/i.test(body)
              ? "Confusing product"
              : /lead|bounce|stale|email/i.test(body)
                ? "Data quality"
                : /login|account|auth/i.test(body)
                  ? "Account traps"
                  : `What ${r.source} is actually saying`;
    out.push({
      theme,
      severity: /scam|refund|broken|hate|worst|unusable|crash/i.test(body) ? "critical" : "high",
      quote: body.length > 280 ? `${body.slice(0, 277)}…` : body,
      source: r.source,
      sourced: r.source !== "Product site",
      howToFix: `Treat this as the wedge. Your MVP should make this complaint impossible: design the first-run and the primary screen so '${theme.toLowerCase()}' cannot be said about the new ${name} killer.`,
    });
  }
  return out;
}

function stackFor(profile: TargetProfile): RiposteBrief["stack"] {
  const b = blob(profile);
  if (profile.kind === "appstore" || profile.kind === "playstore" || (/ios|android|mobile app/.test(b) && /react native|flutter/.test(b))) {
    return {
      recommendation: "Expo + Postgres + Stripe",
      reason: "Stay cross-platform without a native team. Ship TestFlight / Play internal in week one.",
      pieces: ["Expo", "Expo Router", "Postgres", "Stripe", "Tailwind"],
    };
  }
  return {
    recommendation: "TanStack Start + Postgres + Stripe",
    reason: "One TypeScript repo, server functions, and a billing path a solo builder can finish in a week.",
    pieces: ["TanStack Start", "React", "Tailwind", "Postgres", "Stripe", "Resend"],
  };
}

export function buildLocalBrief(input: {
  profile: TargetProfile;
  reviews: ReviewSnippet[];
  websiteText: string | null;
}): RiposteBrief {
  const { profile, reviews, websiteText } = input;
  const plays = playbook(profile, websiteText);
  const sourced = fromReviews(reviews, profile.name);
  const inferred: Complaint[] = plays.slice(0, 6).map((p) => ({
    theme: p.theme,
    severity: p.severity,
    quote: p.quote,
    source: "Product traces",
    sourced: false,
    howToFix: p.howToFix,
  }));

  const complaints: Complaint[] = [];
  for (const c of [...sourced, ...inferred]) {
    if (complaints.some((x) => x.theme === c.theme)) continue;
    complaints.push(c);
    if (complaints.length >= 6) break;
  }
  if (complaints.length === 0) {
    complaints.push({
      theme: "Undifferentiated clone bait",
      severity: "high",
      quote: `${profile.name} already has demand — but the first-run and pricing story are still there to steal.`,
      source: "Product traces",
      sourced: false,
      howToFix: "Copy the category, not the UI. Make the first three minutes and the bill the reasons to switch.",
    });
  }

  const betterName = pickName(profile);
  const who =
    profile.insights["Target persona"] ||
    profile.insights["Audience type"]?.replace(/\[|\]/g, "") ||
    (isAskKind(profile.kind)
      ? `people already asking for this on ${profile.sourceLabel}`
      : `people already paying for ${firstMarket(profile)}`);
  const whyNow =
    profile.kind === "twitter"
      ? `The tweet is live. Demand is typed in public — ship before the thread dies.`
      : profile.kind === "reddit"
        ? `The thread is live. Demand is typed out in public — ship before the next Show HN.`
        : profile.kind === "hackernews"
          ? `HN is already arguing. The comments are the QA script.`
        : profile.kind === "appstore" || profile.kind === "playstore" || profile.kind === "firefox"
        ? `${profile.name} is on the charts${profile.rating ? ` at ${profile.rating.toFixed(1)} stars` : ""}. The 1-stars are a product spec.`
        : profile.kind === "github"
          ? `${profile.name} already has stars. The open issues are the 1-stars.`
        : profile.revenue.last30Days >= 1000
          ? `${profile.name} just did real revenue. Demand is proven; the reviews (or the gaps) tell you what to steal.`
          : `This is public demand on ${profile.sourceLabel}. A sharper first-run can take the next cohort.`;

  const gaps = [
    ...plays.map((p) => p.gap),
    websiteText && /sign in|log in|book a demo/i.test(websiteText) ? "Self-serve instead of demo-gated." : "",
  ]
    .filter(Boolean)
    .filter((g, i, a) => a.indexOf(g) === i)
    .slice(0, 6);

  const stack = stackFor(profile);
  const top = complaints[0]!;
  const slug = hitKey(profile.kind, profile.id);

  const draft: RiposteBrief = {
    productName: profile.name,
    slug,
    thesis:
      isAskKind(profile.kind)
        ? `${profile.sourceLabel} already wrote the spec. ${betterName} wins by shipping “${top.theme.toLowerCase()}” as the first screen, not a landing page that restates the thread.`
        : `${profile.name} is already getting attention on ${profile.sourceLabel}. ${betterName} wins by making “${top.theme.toLowerCase()}” a non-issue and shipping that as the first screen, not a v2 promise.`,
    opportunity: {
      betterName,
      positioning: `The ${firstMarket(profile)} that treats “${top.theme.toLowerCase()}” as the product.`,
      whoItsFor: who,
      whyNow,
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
      "Changelog and comparison page",
    ],
    outOfScope: [
      profile.kind === "appstore" || profile.kind === "playstore" ? "Every native SDK the incumbent ships" : "Native mobile",
      "Multiplayer / teams beyond a single workspace",
      "Every integration the incumbent lists",
      "Custom model training",
      "Marketplace or plugins",
    ],
    launch: {
      firstUsers: isAskKind(profile.kind)
        ? `Reply on ${profile.sourceLabel} with the comparison page and a working first win. The original URL: ${profile.sourceUrl}.`
        : `Go where ${profile.name} is already discussed (${profile.sourceLabel}, 1-star reviews, category subreddits) and reply with the comparison page, not a waitlist screenshot.`,
      pricing: profile.insights["Pricing model"]
        ? `Undercut opacity, not necessarily price. Mirror ${profile.insights["Pricing model"]} but add a useful free tier and an estimator.`
        : "Free tier that completes one real job, then a simple monthly that is easy to explain on a pricing page.",
      differentiator: top.howToFix,
    },
    generatedAt: new Date().toISOString(),
    origin: "traces",
  };
  return attachDetailedPrompts(draft, profile, reviews);
}
