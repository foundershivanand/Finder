import { formatCount, formatRating, formatUsd, hitKey } from "./format";
import type { Complaint, ReviewSnippet, RiposteBrief, TargetProfile, VibeStep } from "./types";

function platformOf(profile: TargetProfile): "ANDROID APP / IOS APP" | "WEB APP / SAAS" {
  if (profile.kind === "appstore" || profile.kind === "playstore") return "ANDROID APP / IOS APP";
  return "WEB APP / SAAS";
}

function rivalName(profile: TargetProfile): string {
  return profile.kind === "reddit" || profile.kind === "twitter" || profile.kind === "hackernews"
    ? "the missing product this thread describes"
    : profile.name;
}

function complaintList(complaints: Complaint[]): string {
  return complaints
    .map(
      (c, i) =>
        `${i + 1}. [${c.severity.toUpperCase()}] ${c.theme}\n   Quote (${c.sourced ? c.source : "inferred"}): ${c.quote}\n   Beat it: ${c.howToFix}`,
    )
    .join("\n");
}

function reviewList(reviews: ReviewSnippet[]): string {
  if (!reviews.length) return "(No public traces captured. Use inferred complaints only — do not invent fake quotes.)";
  return reviews
    .slice(0, 8)
    .map((r) => `- [${r.source}] ${r.title}\n  ${r.url}\n  ${r.body}`)
    .join("\n");
}

function metrics(profile: TargetProfile): string {
  const bits = [
    profile.kind === "trustmrr" ? `Revenue 30d ${formatUsd(profile.revenue.last30Days)}, MRR ${formatUsd(profile.revenue.mrr)}` : null,
    profile.rating != null ? `Store rating ${formatRating(profile.rating)} (${formatCount(profile.ratingsCount)} ratings)` : null,
    profile.installs ? `Installs ${profile.installs}` : null,
    profile.score != null ? `Reddit score ${formatCount(profile.score)}, comments ${formatCount(profile.comments)}` : null,
    profile.rank ? `Chart rank #${profile.rank}` : null,
  ].filter(Boolean);
  return bits.join(" · ") || "Demand is public; revenue/ratings may be incomplete.";
}

const AGENT_ROLES = `Act as ALL of the following, and do not drop a role just because the slice looks small:
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

const HARD_RULES = `HARD RULES
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

function constitution(input: {
  profile: TargetProfile;
  betterName: string;
  who: string;
  positioning: string;
  stack: RiposteBrief["stack"];
  complaints: Complaint[];
  reviews: ReviewSnippet[];
}): string {
  const { profile, betterName, who, positioning, stack, complaints, reviews } = input;
  const platform = platformOf(profile);
  return `${AGENT_ROLES}

I am building a real-world ${platform} named ${betterName}.
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

export function buildMasterBlueprint(input: {
  profile: TargetProfile;
  betterName: string;
  who: string;
  positioning: string;
  whyNow: string;
  thesis: string;
  stack: RiposteBrief["stack"];
  complaints: Complaint[];
  gaps: string[];
  mvpScope: string[];
  outOfScope: string[];
  launch: RiposteBrief["launch"];
  reviews: ReviewSnippet[];
}): string {
  const { profile, betterName, who, positioning, whyNow, thesis, stack, complaints, gaps, mvpScope, outOfScope, launch, reviews } = input;
  const platform = platformOf(profile);
  const mobile = platform !== "WEB APP / SAAS";
  const c1 = complaints[0];

  return `${constitution({ profile, betterName, who, positioning, stack, complaints, reviews })}

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

function slicePrompt(
  constitutionText: string,
  spec: {
    title: string;
    phase: string;
    goal: string;
    files: string;
    requirements: string;
    flow: string;
    screens: string;
    validation: string;
    security: string;
    tests: string;
    done: string;
  },
): string {
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

export function buildVibeGuide(input: {
  profile: TargetProfile;
  betterName: string;
  who: string;
  positioning: string;
  stack: RiposteBrief["stack"];
  complaints: Complaint[];
  reviews: ReviewSnippet[];
}): VibeStep[] {
  const { profile, betterName, who, positioning, stack, complaints, reviews } = input;
  const c1 = complaints[0];
  const c2 = complaints[1];
  const c3 = complaints[2];
  const rival = rivalName(profile);
  const site = profile.website ?? profile.sourceUrl;
  const mobile = profile.kind === "appstore" || profile.kind === "playstore";
  const core = constitution({ profile, betterName, who, positioning, stack, complaints, reviews });
  const slug = hitKey(profile.kind, profile.id);

  const items: Array<Omit<VibeStep, "step">> = [
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
- Three complaint → fix pairs using these themes: ${complaints
          .slice(0, 3)
          .map((c) => c.theme)
          .join("; ")}.
- Pricing teaser (not fake $0 forever). Footer links: Privacy, Terms (can be stub pages with honest “draft — lawyer review”).
- Compare teaser linking to /compare.
- Real copy about ${profile.name}, not lorem. Quote sourced complaints; paraphrase inferred ones and label them.`,
        flow: `1. Land. 2. Read promise. 3. Scan three pains. 4. Click Start the first win (can go to /app or /login stub). 5. Optional: open /compare.`,
        screens: `Home (this slice). Footer legal stubs. 404 if you touch the router.`,
        validation: `No dead buttons. Images have alt. Contrast AA. If a font fails, system stack still looks intentional.`,
        security: `No analytics pixels. No inline third-party scripts. External links rel="noreferrer".`,
        tests: `A browser smoke or component test that the hero, CTA, and three complaint headings render.`,
        done: `Homepage is the product story. 390px has no horizontal scroll. CTA is ≥ 44px.`,
      }),
    },
    {
      title: "Scaffold the app with the core object already on screen",
      why: "Most clones die in empty dashboards. The first logged-in view must already contain sample work.",
      doneWhen: "A fresh account (or demo user) shows useful sample data and one obvious next click.",
      prompt: slicePrompt(core, {
        title: `Workspace scaffold for ${betterName}`,
        phase: "PHASE 3–5 — app shell, auth stub, data",
        goal: `Scaffold the logged-in product so the first screen is a workspace for ${betterName}, already filled with realistic sample data related to: ${profile.description.slice(0, 400)}`,
        files: mobile
          ? `Expo Router app group (app)/(app), seed.ts, auth stub, workspace screen, top bar.`
          : `TanStack Start or Next app router: /app workspace route, seed module, layout with top bar, server function to load sample data.`,
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
        done: `I can enter the app and see work, not an empty illustration.`,
      }),
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
        done: `A screen recording could contrast ${profile.name}'s complaint with this UI.`,
      }),
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
        done: `Stopwatch test: cold user → saved result < 3 minutes.`,
      }),
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
        done: `Subscribe, see quota, cancel, no email required.`,
      }),
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
        done: `The wedge is obvious in a first screenshot of the logged-in app.`,
      }),
    },
    {
      title: "Launch kit: compare, changelog, legal stubs, first 20 users",
      why:
        profile.kind === "reddit"
          ? "The thread is already the distribution. Reply with a working product, not a waitlist."
          : `${profile.name} already has demand. You win with a sharper story, not a broader product.`,
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
        done: `I can copy the launch post and send someone /compare without shame.`,
      }),
    },
  ];

  return items.map((s, i) => ({ ...s, step: i + 1 }));
}

export function attachDetailedPrompts(
  brief: RiposteBrief,
  profile: TargetProfile,
  reviews: ReviewSnippet[],
): RiposteBrief {
  const vibeGuide = buildVibeGuide({
    profile,
    betterName: brief.opportunity.betterName,
    who: brief.opportunity.whoItsFor,
    positioning: brief.opportunity.positioning,
    stack: brief.stack,
    complaints: brief.complaints,
    reviews,
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
    reviews,
  });
  return { ...brief, vibeGuide, masterBlueprint };
}
