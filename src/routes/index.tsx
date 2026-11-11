import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AllLinksButton } from "@/components/all-links-button";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { PlatformIcon } from "@/components/platform-icons";
import { HitCard, ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { extractHitRef } from "@/lib/format";
import { fetchDesk, fetchScout } from "@/lib/server-fns";
import type { DeskKind, ScoutFeed, ScoutHit, ScoutProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => fetchScout(),
  component: Home,
  pendingComponent: ScoutPending,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">The desk is quiet</h1>
        <p className="mt-3 text-sm text-muted">{error instanceof Error ? error.message : "Could not load the scout."}</p>
        <p className="mt-2 text-sm text-muted">Reload in a moment, or paste a TrustMRR, store, Reddit, Product Hunt, or X URL.</p>
        <Button asChild className="mt-6" size="sm">
          <a href="/">Refresh</a>
        </Button>
      </main>
    </div>
  ),
});

type TmrrTab = "earning" | "growing" | "recent" | "listed";

const PRIMARY_DESKS: Array<{ id: DeskKind; label: string; hint: string }> = [
  { id: "reddit", label: "Reddit", hint: "Unmet requests & app ideas from r/SomebodyMakeThis, r/AppIdeas, and r/SaaS" },
  { id: "producthunt", label: "Product Hunt", hint: "Today’s product launches — comment feedback is the spec" },
  { id: "appstore", label: "App Store", hint: "Top grossing iOS apps — read 1-star reviews to find open flanks" },
  { id: "playstore", label: "Play Store", hint: "Android hits you can beat with a faster, cleaner first-run" },
  { id: "trustmrr", label: "TrustMRR", hint: "Verified MRR & revenue — clone what already converts and sells" },
  { id: "twitter", label: "Twitter / X", hint: "Live asks: 'I wish there was an app that...' and founder complaints" },
];

const OTHER_DESKS: Array<{ id: DeskKind; label: string; hint: string }> = [
  { id: "hackernews", label: "Hacker News", hint: "Show HN and Ask HN launches with brutal developer feedback" },
  { id: "github", label: "GitHub", hint: "Trending repos whose issue trackers are product opportunity specs" },
  { id: "betalist", label: "BetaList", hint: "Startups still in beta where you can beat their launch" },
  { id: "lobsters", label: "Lobsters", hint: "Builder discussions with technical pain points" },
  { id: "devto", label: "DEV", hint: "Showdev and side projects seeking cleaner alternatives" },
  { id: "firefox", label: "Firefox", hint: "Add-ons with users and ratings you can surpass" },
  { id: "launchingnext", label: "Launching Next", hint: "Newest startups and trending side projects" },
];

const ALL_DESKS = [...PRIMARY_DESKS, ...OTHER_DESKS];

const TMRR_TABS: Array<{ id: TmrrTab; label: string; hint: string }> = [
  { id: "earning", label: "Earning well", hint: "$500+ in 30 days or $200+ MRR" },
  { id: "growing", label: "Growing fast", hint: "Highest 30-day revenue growth" },
  { id: "recent", label: "Just listed", hint: "Newest startups on TrustMRR" },
  { id: "listed", label: "For sale", hint: "Acquisition listings with verified metrics" },
];

function Home() {
  const feed = Route.useLoaderData() as ScoutFeed;
  const navigate = useNavigate();
  const [desk, setDesk] = useState<DeskKind>("trustmrr");
  const [tmrrTab, setTmrrTab] = useState<TmrrTab>("earning");
  const [query, setQuery] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [deskHits, setDeskHits] = useState<Partial<Record<DeskKind, ScoutHit[]>>>({});
  const [deskError, setDeskError] = useState<Partial<Record<DeskKind, string>>>({});
  const [deskLoading, setDeskLoading] = useState<Partial<Record<DeskKind, boolean>>>({});
  const requested = useRef<Set<DeskKind>>(new Set());

  useEffect(() => {
    if (desk === "trustmrr") return;
    if (requested.current.has(desk)) return;
    requested.current.add(desk);
    setDeskLoading((s) => ({ ...s, [desk]: true }));
    void fetchDesk({ data: { kind: desk } })
      .then((res) => {
        setDeskHits((s) => ({ ...s, [desk]: res.hits }));
        if (res.error) setDeskError((s) => ({ ...s, [desk]: res.error }));
      })
      .catch((err: unknown) => {
        requested.current.delete(desk);
        setDeskHits((s) => ({ ...s, [desk]: [] }));
        setDeskError((s) => ({ ...s, [desk]: err instanceof Error ? err.message : "Could not load this desk" }));
      })
      .finally(() => {
        setDeskLoading((s) => ({ ...s, [desk]: false }));
      });
  }, [desk]);

  const tmrrProducts = feed[tmrrTab];
  const hits = useMemo(() => deskHits[desk] ?? [], [deskHits, desk]);

  const filteredTmrr = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tmrrProducts;
    return tmrrProducts.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [tmrrProducts, query]);

  const filteredHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hits;
    return hits.filter((h) => {
      return (
        h.name.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        (h.category ?? "").toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.badges.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [hits, query]);

  function onLookup(e: FormEvent) {
    e.preventDefault();
    const hit = extractHitRef(query);
    if (hit) {
      setLookupError(null);
      void navigate({ to: "/hit/$kind/$id", params: { kind: hit.kind, id: hit.id } });
      return;
    }
    if (desk === "trustmrr" && filteredTmrr.length === 1) {
      setLookupError(null);
      void navigate({ to: "/hit/$kind/$id", params: { kind: "trustmrr", id: filteredTmrr[0].slug } });
      return;
    }
    if (desk !== "trustmrr" && filteredHits.length === 1) {
      setLookupError(null);
      void navigate({ to: "/hit/$kind/$id", params: { kind: filteredHits[0].kind, id: filteredHits[0].id } });
      return;
    }
    if (query.trim() && ((desk === "trustmrr" && filteredTmrr.length === 0) || (desk !== "trustmrr" && filteredHits.length === 0))) {
      setLookupError("No match in this desk. Paste a TrustMRR, store, Reddit, Product Hunt, GitHub, or X URL.");
    } else {
      setLookupError(null);
    }
  }

  const count =
    desk === "trustmrr" ? feed.earning.length : deskLoading[desk] && !deskHits[desk] ? 0 : hits.length;

  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* Minimal Editorial Hero */}
        <Hero desk={desk} count={count} />

        {/* Omnibar Search & Direct URL Deconstruct */}
        <form onSubmit={onLookup} className="mt-6 relative">
          <div className="flex flex-col sm:flex-row gap-2 p-1 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-white/[0.16] focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20 backdrop-blur-xl transition-all shadow-sm">
            <div className="relative flex-1 flex items-center">
              <Search className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLookupError(null);
                }}
                placeholder="Search ideas, or paste any Reddit / Product Hunt / App Store / Play Store / TrustMRR URL..."
                className="pl-9 pr-8 border-0 bg-transparent focus-visible:ring-0 text-xs sm:text-sm h-9.5 text-zinc-100 placeholder:text-zinc-500"
                aria-label="Search opportunities"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 p-1 rounded-md text-zinc-500 hover:text-zinc-200"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-9.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs sm:w-auto shrink-0 transition-colors shadow-sm"
            >
              <span>Analyze & Build</span>
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          {lookupError ? <p className="mt-2 text-xs text-rose-400 pl-1">{lookupError}</p> : null}
        </form>

        {/* Platform Source Selector Tabs */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3 text-zinc-500" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Channels
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-600">
              {ALL_DESKS.length} live desks
            </span>
          </div>

          {/* Primary 6 Platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 pt-0.5">
            {PRIMARY_DESKS.map((d) => {
              const active = desk === d.id;
              const hitCount = d.id === "trustmrr" ? feed.earning.length : (deskHits[d.id]?.length ?? (deskLoading[d.id] ? "…" : "—"));
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesk(d.id)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-all group",
                    active
                      ? "bg-white/[0.08] border-white/20 text-white shadow-sm"
                      : "bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] hover:border-white/[0.10]"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <PlatformIcon kind={d.id} className="size-3.5 shrink-0" />
                    <span className="truncate text-xs">{d.label}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1 py-0.2 rounded tabular-nums shrink-0",
                      active ? "bg-white/[0.12] text-white font-medium" : "text-zinc-600"
                    )}
                  >
                    {hitCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Other Desks Strip */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-600 px-1 shrink-0">
              More:
            </span>
            {OTHER_DESKS.map((d) => {
              const active = desk === d.id;
              const hitCount = deskHits[d.id]?.length ?? (deskLoading[d.id] ? "…" : "—");
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesk(d.id)}
                  className={cn(
                    "h-7 shrink-0 rounded-md px-2 text-[11px] inline-flex items-center gap-1.5 border transition-all",
                    active
                      ? "bg-white/[0.08] border-white/20 text-white font-medium"
                      : "bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}
                >
                  <PlatformIcon kind={d.id} className="size-3 shrink-0" />
                  <span>{d.label}</span>
                  <span className="font-mono text-[9px] text-zinc-600 tabular-nums">{hitCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desk Description Hint */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500 px-0.5">
          <p className="line-clamp-1">{ALL_DESKS.find((d) => d.id === desk)?.hint}</p>
          {deskLoading[desk] ? (
            <span className="text-emerald-400 font-mono text-[10px] shrink-0 ml-2">Syncing...</span>
          ) : null}
        </div>
        {deskError[desk] ? <p className="mt-1.5 text-xs text-rose-400">{deskError[desk]}</p> : null}

        {/* TrustMRR subtabs if TrustMRR is selected */}
        {desk === "trustmrr" ? (
          <div className="mt-5">
            <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-x-auto">
              {TMRR_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTmrrTab(t.id)}
                  className={cn(
                    "h-8 shrink-0 rounded-lg px-3 text-xs font-medium transition-all inline-flex items-center gap-1.5",
                    tmrrTab === t.id
                      ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  )}
                >
                  <span>{t.label}</span>
                  <span className="font-mono text-[10px] text-zinc-500 tabular-nums">{feed[t.id].length}</span>
                </button>
              ))}
            </div>
            <ProductGrid products={filteredTmrr} />
          </div>
        ) : deskLoading[desk] && !deskHits[desk] ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl bg-card border border-white/[0.05]" />
            ))}
          </div>
        ) : (
          <HitGrid hits={filteredHits} empty={emptyCopy(desk)} />
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function emptyCopy(desk: DeskKind): string {
  const labels: Partial<Record<DeskKind, string>> = {
    reddit: "Reddit desk is updating. Try Product Hunt, App Store, or Twitter.",
    producthunt: "Product Hunt feed was quiet. Try Hacker News, Reddit, or App Store.",
    appstore: "The App Store chart was quiet. Try Google Play or TrustMRR.",
    playstore: "The Play Store chart was quiet. Try App Store or Reddit.",
    trustmrr: "No products matched this filter. Try another tab.",
    twitter: "Twitter search is refreshing. Try Reddit or Hacker News.",
    hackernews: "Hacker News did not return stories. Try GitHub or Product Hunt.",
    github: "GitHub search was quiet. Try Launching Next.",
    betalist: "BetaList had no launches right now. Try Product Hunt.",
    lobsters: "Lobsters was empty. Try Hacker News.",
    devto: "DEV had no showdev posts. Try GitHub.",
    firefox: "Firefox add-ons did not load. Try Play Store.",
    launchingnext: "Launching Next was quiet. Try BetaList.",
  };
  return labels[desk] ?? "This desk is quiet. Try another source.";
}

function Hero({ desk, count }: { desk: DeskKind; count: number }) {
  const copy = heroCopy(desk, count);
  return (
    <section className="pt-6 sm:pt-10">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-white/[0.03] text-zinc-400 border border-white/[0.06]">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-200">{copy.kicker}</span>
          <span className="text-zinc-600">•</span>
          <span>{copy.badge}</span>
        </div>

        <AllLinksButton variant="pill" label="All Links (6 Hubs)" />
      </div>

      <h1 className="mt-3.5 max-w-3xl text-2xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-white leading-[1.15]">
        {copy.title[0]} {copy.title[1]}{" "}
        <span className="text-zinc-400 font-normal">{copy.title[2]}</span>
      </h1>

      <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-400">
        {copy.body}
      </p>

      {/* Minimal Playbook Strip */}
      <div className="mt-4.5 flex flex-wrap items-center gap-2 sm:gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Playbook:
        </span>
        {copy.steps.map((s, idx) => (
          <div key={s.n} className="flex items-center gap-1.5 text-zinc-300">
            <span className="font-mono text-[10px] text-zinc-500">{s.n}</span>
            <span className="font-medium text-xs">{s.t}</span>
            {idx < copy.steps.length - 1 ? (
              <span className="text-zinc-700 ml-1">→</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function heroCopy(desk: DeskKind, count: number) {
  const catalog: Partial<Record<DeskKind, ReturnType<typeof trustHero>>> = {
    reddit: {
      kicker: "Reddit Desk",
      title: ["Unmet requests.", "Ready buyers.", "Vibe-code the antidote."],
      body: "Finder scouts r/SomebodyMakeThis, r/AppIdeas, and r/SaaS threads where real users ask for a product. Tap any idea to get a copy-paste vibe-coding plan.",
      badge: `${count} live asks`,
      live: "Live from Reddit",
      steps: [
        { n: "01", t: "Scout the ask", d: "Threads where buyers describe their missing software." },
        { n: "02", t: "Extract the spec", d: "Post details and top comments become acceptance criteria." },
        { n: "03", t: "Vibe-code the build", d: "Step-by-step prompts ready for Cursor, Grok, or Claude." },
      ],
    },
    producthunt: {
      kicker: "Product Hunt Desk",
      title: ["Today’s launches.", "Fresh demand.", "Ship the sharper version."],
      body: "Discover newly launched products on Product Hunt. Read positioning gaps and comments, then generate a vibe-coding blueprint to beat them.",
      badge: `${count} launches`,
      live: "Live from Product Hunt",
      steps: [
        { n: "01", t: "Scout fresh hunts", d: "Products gaining initial traction right now." },
        { n: "02", t: "Find the hole", d: "Analyze taglines and maker gaps to find your wedge." },
        { n: "03", t: "Vibe-code it", d: "A 27-section master PRD plus sequenced prompts." },
      ],
    },
    appstore: {
      kicker: "App Store Desk",
      title: ["Charting iOS apps.", "1-star gold.", "Ship the cleaner alternative."],
      body: "Top grossing and paid iOS apps filtered by rating vulnerabilities. Open any app to mine the negative reviews and generate a vibe-code plan.",
      badge: `${count} iOS targets`,
      live: "Live from Apple App Store",
      steps: [
        { n: "01", t: "Scout the charts", d: "Apps with proven distribution and user volume." },
        { n: "02", t: "Mine the 1-stars", d: "Extract repeated bugs, paywalls, and feature gaps." },
        { n: "03", t: "Vibe-code the fix", d: "Build the app that makes those 1-star complaints impossible." },
      ],
    },
    playstore: {
      kicker: "Play Store Desk",
      title: ["Android hits.", "Open flanks.", "A week to a better first run."],
      body: "Charting Google Play apps in productivity, tools, and business with beatable ratings. We surface the ones leaving users frustrated.",
      badge: `${count} Android targets`,
      live: "Live from Google Play",
      steps: [
        { n: "01", t: "Scout top installs", d: "High-volume apps that users already search for." },
        { n: "02", t: "Read user grievances", d: "Ads, crashes, complicated UX — the exact wedge." },
        { n: "03", t: "Vibe-code the fix", d: "A sequenced build prompt focused on instant value." },
      ],
    },
    twitter: {
      kicker: "Twitter / X Desk",
      title: ["People typing the ask.", "In public, on X.", "Ship before the thread cools."],
      body: "Live posts: “I wish there was an app”, “someone should make”, and build-in-public pain points. The tweet thread is your product spec.",
      badge: `${count} asks`,
      live: "Live from X",
      steps: [
        { n: "01", t: "Scout the asks", d: "Tweets where buyers explicitly state their willingness to pay." },
        { n: "02", t: "Read the thread", d: "Direct complaints and replies form your feature backlog." },
        { n: "03", t: "Vibe-code it", d: "Paste the prompts. Reply with a working product, not a waitlist." },
      ],
    },
    trustmrr: trustHero(count),
    hackernews: {
      kicker: "Hacker News Desk",
      title: ["Show HN.", "Ask HN.", "The comment section is your QA."],
      body: "Technical launches and requests with honest discussion. Open a story, inspect the criticism, and generate a plan that survives HN critique.",
      badge: `${count} stories`,
      live: "Live from Hacker News",
      steps: [
        { n: "01", t: "Scout Show & Ask", d: "Projects with organic community discussions." },
        { n: "02", t: "Read the feedback", d: "Top comments tell you exactly why competitors fail." },
        { n: "03", t: "Vibe-code the fix", d: "A bulletproof architecture tailored to those lessons." },
      ],
    },
    github: {
      kicker: "GitHub Desk",
      title: ["Starred repos.", "Issue backlogs.", "A SaaS hiding in the tracker."],
      body: "High-growth open-source repositories whose issue trackers describe the missing commercial cloud product.",
      badge: `${count} repos`,
      live: "Live from GitHub",
      steps: [
        { n: "01", t: "Scout stars & growth", d: "Projects with real developer adoption." },
        { n: "02", t: "Read the issues", d: "Unresolved feature requests are user demand." },
        { n: "03", t: "Vibe-code it", d: "Build a polished commercial product, not a clone." },
      ],
    },
    betalist: {
      kicker: "BetaList Desk",
      title: ["Still in beta.", "Still clumsy.", "Beat them to market."],
      body: "Startups on BetaList — early enough that a sharper first-run can capture the market cohort.",
      badge: `${count} betas`,
      live: "Live from BetaList",
      steps: [
        { n: "01", t: "Scout new betas", d: "Early startups introducing their concept." },
        { n: "02", t: "Spot the weakness", d: "Compare their tagline with their onboarding." },
        { n: "03", t: "Vibe-code it", d: "Ship the clean version they intended to build." },
      ],
    },
  };
  return catalog[desk] ?? trustHero(count);
}

function trustHero(count: number) {
  return {
    kicker: "TrustMRR Desk",
    title: ["Find what’s earning.", "Steal the pain.", "Vibe-code it better."],
    body: "Finder scouts products with verified Stripe and Lemon Squeezy MRR, reads the negatives, and generates sequenced prompts for Cursor, Grok, and Claude.",
    badge: `${count} earning startups`,
    live: "Live from TrustMRR",
    steps: [
      { n: "01", t: "Scout revenue", d: "Products with verified paying subscribers." },
      { n: "02", t: "Mine the 1-stars", d: "Public complaints and pricing gaps, clustered." },
      { n: "03", t: "Vibe-code the rival", d: "A 27-section master PRD plus implementation prompts." },
    ],
  };
}

function ProductGrid({ products }: { products: ScoutProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
        <p className="text-sm font-medium text-zinc-300">No items match this filter</p>
        <p className="mt-1 text-xs text-zinc-500">Try another tab, or search a keyword above.</p>
      </div>
    );
  }
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

function HitGrid({ hits, empty }: { hits: ScoutHit[]; empty: string }) {
  if (hits.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
        <p className="text-sm font-medium text-zinc-300">Desk channel is quiet right now</p>
        <p className="mt-1 text-xs text-zinc-500">{empty}</p>
      </div>
    );
  }
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {hits.map((h) => (
        <HitCard key={`${h.kind}:${h.id}`} hit={h} />
      ))}
    </div>
  );
}

function ScoutPending() {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <Skeleton className="h-5 w-28 rounded-full bg-white/[0.05]" />
        <Skeleton className="mt-3.5 h-10 w-full max-w-md rounded-lg bg-white/[0.05]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl bg-white/[0.04] border border-white/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  );
}
