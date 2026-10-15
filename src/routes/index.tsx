import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Compass, Download, Filter, Flame, Layers, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AppHeader } from "@/components/app-header";
import { PlatformIcon } from "@/components/platform-icons";
import { HitCard, ProductCard } from "@/components/product-card";
import { PwaInstallButton, usePwaInstall } from "@/components/pwa-install";
import { Badge } from "@/components/ui/badge";
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
  const { isStandalone } = usePwaInstall();

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
  const hits = deskHits[desk] ?? [];

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
        {/* Minimal Premium Hero */}
        <Hero desk={desk} count={count} />

        {/* Omnibar Search & Direct URL Deconstruct */}
        <form onSubmit={onLookup} className="mt-8 relative">
          <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-card border border-border/80 shadow-lg shadow-black/40 focus-within:border-emerald-500/50 transition-all">
            <div className="relative flex-1 flex items-center">
              <Search className="pointer-events-none absolute left-3.5 size-4 text-faint" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLookupError(null);
                }}
                placeholder="Search ideas, or paste any Reddit / Product Hunt / App Store / Play Store / TrustMRR / X URL..."
                className="pl-10 pr-9 border-0 bg-transparent focus-visible:ring-0 text-sm h-11 text-foreground placeholder:text-muted/60"
                aria-label="Search opportunities"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 p-1 rounded-md text-faint hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:w-auto shrink-0 transition-colors shadow-sm"
            >
              <span>Analyze & Build</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </div>
          {lookupError ? <p className="mt-2 text-xs text-rose-400 pl-2">{lookupError}</p> : null}
        </form>

        {/* Platform Source Selector Tabs */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <Filter className="size-3.5 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Explore Sources
              </span>
            </div>
            <span className="text-[11px] font-mono text-faint">
              {ALL_DESKS.length} live channels
            </span>
          </div>

          {/* Primary 6 Requested Platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            {PRIMARY_DESKS.map((d) => {
              const active = desk === d.id;
              const hitCount = d.id === "trustmrr" ? feed.earning.length : (deskHits[d.id]?.length ?? (deskLoading[d.id] ? "…" : "—"));
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesk(d.id)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all group",
                    active
                      ? "bg-card-2 border-emerald-500/50 text-foreground shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20"
                      : "bg-card/70 border-border/70 text-muted hover:text-foreground hover:bg-card-2 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <PlatformIcon kind={d.id} className="size-4 shrink-0" />
                    <span className="truncate">{d.label}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums shrink-0",
                      active ? "bg-emerald-500/20 text-emerald-300 font-semibold" : "bg-card text-faint"
                    )}
                  >
                    {hitCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Other Sites Toggle / Row */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] uppercase tracking-wider font-mono text-faint px-2 shrink-0">
              Other Sites:
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
                    "h-8 shrink-0 rounded-lg px-2.5 text-xs inline-flex items-center gap-1.5 border transition-all",
                    active
                      ? "bg-card-2 border-emerald-500/40 text-foreground font-medium"
                      : "bg-card/40 border-border/50 text-muted hover:text-foreground hover:bg-card-2"
                  )}
                >
                  <PlatformIcon kind={d.id} className="size-3.5 shrink-0" />
                  <span>{d.label}</span>
                  <span className="font-mono text-[10px] text-faint tabular-nums">{hitCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desk Description Hint */}
        <div className="mt-3 flex items-center justify-between text-xs text-faint px-1">
          <p>{ALL_DESKS.find((d) => d.id === desk)?.hint}</p>
          {deskLoading[desk] ? (
            <span className="text-emerald-400 font-mono text-[11px] animate-pulse">Syncing feed...</span>
          ) : null}
        </div>
        {deskError[desk] ? <p className="mt-2 text-xs text-rose-400">{deskError[desk]}</p> : null}

        {/* TrustMRR subtabs if TrustMRR is selected */}
        {desk === "trustmrr" ? (
          <div className="mt-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TMRR_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTmrrTab(t.id)}
                  className={cn(
                    "h-9 shrink-0 rounded-xl px-3.5 text-xs font-medium transition-all border",
                    tmrrTab === t.id
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                      : "bg-card border-border/70 text-muted hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span className="ml-2 font-mono text-[10px] tabular-nums text-faint">{feed[t.id].length}</span>
                </button>
              ))}
            </div>
            <ProductGrid products={filteredTmrr} />
          </div>
        ) : deskLoading[desk] && !deskHits[desk] ? (
          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl bg-card border border-border/60" />
            ))}
          </div>
        ) : (
          <HitGrid hits={filteredHits} empty={emptyCopy(desk)} />
        )}
      </main>
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
    <section className="stagger-in pt-8 sm:pt-12">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-card-2 border border-border text-emerald-400 font-medium">
          {copy.kicker}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-muted bg-card border border-border">
          {copy.live}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/40">
          {copy.badge}
        </span>
      </div>

      <h1 className="mt-4 max-w-4xl text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
        {copy.title.map((line, idx) => (
          <span
            key={line}
            className={cn("block", idx === 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300" : "")}
          >
            {line}
          </span>
        ))}
      </h1>

      <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-muted">
        {copy.body}
      </p>

      {/* 3 Step Workflow */}
      <ol className="mt-7 grid gap-3 sm:grid-cols-3">
        {copy.steps.map((s) => (
          <li
            key={s.n}
            className="rounded-2xl bg-card/80 border border-border/80 p-4 transition-colors hover:border-emerald-500/30 hover:bg-card-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-emerald-400">{s.n}</span>
              <Sparkles className="size-3.5 text-faint" />
            </div>
            <p className="mt-2 font-semibold text-sm text-foreground">{s.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
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
      <div className="mt-8 rounded-2xl bg-card border border-border p-12 text-center">
        <p className="font-semibold text-foreground">Nothing in this cut</p>
        <p className="mt-1 text-xs text-muted">Try another tab, or paste a TrustMRR URL above.</p>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

function HitGrid({ hits, empty }: { hits: ScoutHit[]; empty: string }) {
  if (hits.length === 0) {
    return (
      <div className="mt-8 rounded-2xl bg-card border border-border p-12 text-center">
        <p className="font-semibold text-foreground">Nothing in this desk right now</p>
        <p className="mt-1 text-xs text-muted">{empty}</p>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-4 h-12 w-full max-w-xl rounded-xl" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
