import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, BookmarkCheck, Boxes, Check, Download, ExternalLink, FolderKanban, ListOrdered, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { BriefView, CopyButton, PlanSections } from "@/components/brief-view";
import { PlatformIcon } from "@/components/platform-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCount, formatGrowth, formatRating, formatUsd, initials, isDeskKind, isSafeHitId } from "@/lib/format";
import { generateBrief, fetchDossier } from "@/lib/server-fns";
import { getSavedBrief, removeBrief, saveBrief } from "@/lib/saved-briefs";
import { pushIdeaToProjectManage, mapOpportunityTag } from "@/lib/project-manage";
import type { ProductDossier, RiposteBrief, TargetProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hit/$kind/$id")({
  loader: ({ params }) => {
    const kind = params.kind;
    const id = params.id;
    if (!isDeskKind(kind) || !isSafeHitId(kind, id)) {
      throw new Error("This opportunity link is not valid.");
    }
    return fetchDossier({ data: { kind, id } });
  },
  component: HitPage,
  pendingComponent: HitPending,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Couldn’t load this opportunity</h1>
        <p className="mt-3 text-sm text-muted">{error instanceof Error ? error.message : "Could not load this listing."}</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to scout</Link>
        </Button>
      </main>
    </div>
  ),
});

const STAGE_LINES = [
  "Reading the product listing and negatives",
  "Clustering 1-star reviews and user requests",
  "Writing copy-paste vibe-coding prompts",
];

function HitPage() {
  const dossier = Route.useLoaderData() as ProductDossier;
  const profile = dossier.profile;
  const [brief, setBrief] = useState<RiposteBrief>(dossier.brief);
  const [planReady, setPlanReady] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [iconBroken, setIconBroken] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    const existing = getSavedBrief(dossier.brief.slug);
    if (existing) {
      setBrief(existing.brief);
      setSaved(true);
      setPlanReady(true);
    } else {
      setBrief(dossier.brief);
      setSaved(false);
      setPlanReady(false);
    }
    setJustGenerated(false);
    setIconBroken(false);
    setWarning(null);
  }, [dossier.brief, profile.id, profile.kind]);

  useEffect(() => {
    if (!busy) return;
    setStage(0);
    const id = window.setInterval(() => {
      setStage((s) => (s + 1) % STAGE_LINES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [busy]);

  async function run() {
    if (busy) return;
    setBusy(true);
    setJustGenerated(false);
    setWarning(null);
    const started = Date.now();
    const local = dossier.brief;
    let next: RiposteBrief = local;
    try {
      const result = await generateBrief({ data: { kind: profile.kind, id: profile.id } });
      if (result.ok && result.brief) {
        next = result.brief;
        if (result.warning) setWarning(result.warning);
      } else if (!result.ok) {
        next = local;
        setWarning(result.error || "Could not reach Grok — showing traces plan.");
      }
    } catch {
      next = local;
      setWarning("Could not reach Grok — showing traces plan.");
    }
    const elapsed = Date.now() - started;
    if (elapsed < 700) {
      await new Promise((r) => window.setTimeout(r, 700 - elapsed));
    }
    setBrief(next);
    setPlanReady(true);
    setJustGenerated(true);
    setBusy(false);
    window.requestAnimationFrame(() => {
      document.getElementById("vibe-plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleSave() {
    if (!brief || !planReady) return;
    if (saved) {
      removeBrief(brief.slug);
      setSaved(false);
      return;
    }
    saveBrief({
      savedAt: new Date().toISOString(),
      brief,
      profile: {
        kind: profile.kind,
        id: profile.id,
        slug: brief.slug,
        name: profile.name,
        icon: profile.icon,
        category: profile.category,
        revenue: profile.revenue,
        website: profile.website,
      },
    });
    setSaved(true);
  }

  function downloadMarkdown() {
    const lines = [
      `# Finder Vibe Coding Blueprint: ${brief.opportunity.betterName}`,
      `Generated for: ${brief.productName}`,
      `Thesis: ${brief.thesis}`,
      "",
      "## 1. Positioning",
      `- **Product Name**: ${brief.opportunity.betterName}`,
      `- **Target Audience**: ${brief.opportunity.whoItsFor}`,
      `- **Positioning Angle**: ${brief.opportunity.positioning}`,
      `- **Why Now**: ${brief.opportunity.whyNow}`,
      "",
      "## 2. Master Blueprint",
      brief.masterBlueprint ?? "None",
      "",
      "## 3. Implementation Sequence",
      ...brief.vibeGuide.flatMap((s) => [
        `### Step ${s.step}: ${s.title}`,
        `*Why*: ${s.why}`,
        "",
        s.prompt,
        "",
        `*Done When*: ${s.doneWhen}`,
        "",
      ]),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.opportunity.betterName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePushToProjectManage() {
    setPushed(true);
    setTimeout(() => setPushed(false), 2500);
    pushIdeaToProjectManage({
      name: brief.opportunity.betterName || profile.name,
      description: brief.thesis || brief.opportunity.positioning || profile.description || "",
      url: profile.website || profile.sourceUrl || window.location.href,
      tag: mapOpportunityTag(profile.kind, profile.category),
      status: "idea",
      source: `Finder (${profile.kind})`,
      sourceUrl: window.location.href,
      blueprint: brief.masterBlueprint ?? undefined,
      vibeGuide: brief.vibeGuide?.map((s) => ({
        step: s.step,
        title: s.title,
        why: s.why,
        prompt: s.prompt,
        doneWhen: s.doneWhen,
      })),
    });
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/"
          className="mt-6 inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Scout
        </Link>

        <ProfileHero profile={profile} iconBroken={iconBroken} onIconError={() => setIconBroken(true)} />

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-border/70">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                {planReady ? "Vibe Coding Plan Ready" : "Market Flank Analysis"}
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {profile.kind === "reddit"
                  ? `Ship ${brief.opportunity.betterName}`
                  : `Beat ${brief.productName} with ${brief.opportunity.betterName}`}
              </h2>
            </div>
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
              <Button
                type="button"
                size="sm"
                onClick={handlePushToProjectManage}
                className="h-9 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02]"
                title="Push this idea into Project Manage to track tasks and build"
              >
                {pushed ? <Check className="size-3.5 mr-1.5 text-emerald-200" /> : <FolderKanban className="size-3.5 mr-1.5" />}
                <span>{pushed ? "Pushed to Project Manage!" : "Push to Project Manage"}</span>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 px-3 text-xs border-border bg-card hover:bg-card-2 text-zinc-300 hover:text-white"
                title="Open Reusable Code Library for pre-built modules"
              >
                <a
                  href="https://reusable-library.foundershivanand.workers.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <Boxes className="size-3.5 text-emerald-400" />
                  <span>Modules</span>
                  <ExternalLink className="size-2.5 opacity-60" />
                </a>
              </Button>
              {planReady ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadMarkdown}
                    className="h-9 px-3 text-xs border-border bg-card hover:bg-card-2"
                  >
                    <Download className="size-3.5 mr-1.5 text-muted" />
                    Export .md
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleSave}
                    className="h-9 px-3 text-xs border-border bg-card hover:bg-card-2"
                  >
                    {saved ? <BookmarkCheck className="size-3.5 mr-1.5 text-emerald-400" /> : <Bookmark className="size-3.5 mr-1.5 text-muted" />}
                    {saved ? "Saved" : "Save"}
                  </Button>
                </>
              ) : null}
              <GenerateButton busy={busy} planReady={planReady} onClick={() => void run()} />
            </div>
          </div>

          {busy ? (
            <div className="mt-4 p-3 rounded-xl bg-card border border-emerald-500/30 flex items-center gap-3">
              <LoaderCircle className="size-4 animate-spin text-emerald-400 shrink-0" />
              <p className="text-xs font-mono text-emerald-300">{STAGE_LINES[stage]}...</p>
            </div>
          ) : null}

          {justGenerated && !busy ? (
            <p className="mt-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 px-4 py-3 text-xs text-emerald-300">
              ✓ Plan ready — copy each prompt in order into Cursor or your coding agent. {brief.vibeGuide.length} sequenced steps for {brief.opportunity.betterName}.
            </p>
          ) : null}
          {warning && !busy ? <p className="mt-2 text-xs text-amber-400/90">{warning}</p> : null}

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted">
            {profile.kind === "reddit"
              ? "The thread comments are the acceptance tests. Generate writes a sequenced vibe-code plan you can paste into your coding agent."
              : "Negatives are mined from public store reviews and public traces. Generate writes the sequenced build plan."}
          </p>

          <div className="mt-8">
            <BriefView brief={brief} reviews={dossier.reviews} showPlan={false} kind={profile.kind} />
          </div>

          <div className="mt-12">
            {planReady ? (
              <PlanSections brief={brief} />
            ) : (
              <GeneratePanel busy={busy} onGenerate={() => void run()} name={brief.opportunity.betterName} />
            )}
          </div>
        </section>
      </main>

      <AppFooter />

      {/* Mobile Sticky Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="sm"
            onClick={handlePushToProjectManage}
            className="h-10 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shrink-0"
            title="Push to Project Manage"
          >
            {pushed ? <Check className="size-4 mr-1 text-emerald-200" /> : <FolderKanban className="size-4 mr-1" />}
            <span>{pushed ? "Pushed" : "Build"}</span>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-10 px-2.5 border-border bg-card text-zinc-300 shrink-0"
            title="Reusable Code Library"
          >
            <a
              href="https://reusable-library.foundershivanand.workers.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <Boxes className="size-4 text-emerald-400" />
            </a>
          </Button>
          {planReady ? (
            <Button type="button" variant="outline" size="sm" className="h-10 px-3 border-border" onClick={toggleSave}>
              {saved ? <BookmarkCheck className="size-4 text-emerald-400" /> : <Bookmark className="size-4" />}
            </Button>
          ) : null}
          <GenerateButton busy={busy} planReady={planReady} onClick={() => void run()} className="flex-1 h-10" />
        </div>
      </div>
    </div>
  );
}

function ProfileHero({
  profile,
  iconBroken,
  onIconError,
}: {
  profile: TargetProfile;
  iconBroken: boolean;
  onIconError: () => void;
}) {
  const growth = formatGrowth(profile.growth30d ?? undefined);
  return (
    <section className="mt-4 rounded-xl bg-card/60 border border-white/[0.07] p-4.5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-white/[0.08] text-xs font-semibold text-zinc-400">
          {profile.icon && !iconBroken ? (
            <img
              src={profile.icon}
              alt=""
              referrerPolicy="no-referrer"
              className="size-12 object-cover"
              onError={onIconError}
            />
          ) : (
            <span className="font-mono text-xs">{initials(profile.name)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <PlatformIcon kind={profile.kind} className="size-3.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
              {profile.sourceLabel}
              {profile.category ? ` • ${profile.category}` : ""}
            </span>
          </div>
          <h1 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight text-white leading-snug">
            {profile.name}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400 line-clamp-3">
            {profile.description}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {profile.onSale ? <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">For sale</span> : null}
            {profile.stealthMode ? <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">Stealth</span> : null}
            {profile.developer ? <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">{profile.developer}</span> : null}
            {profile.subreddit ? <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">r/{profile.subreddit}</span> : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-white/[0.06] pt-4">
        {profile.kind === "trustmrr" ? (
          <>
            <Money label="Last 30 days" value={formatUsd(profile.revenue.last30Days)} />
            <Money label="MRR" value={formatUsd(profile.revenue.mrr)} />
            <Money label="All-time" value={formatUsd(profile.revenue.total)} extra={growth} />
          </>
        ) : profile.kind === "reddit" || profile.kind === "twitter" || profile.kind === "hackernews" || profile.kind === "lobsters" || profile.kind === "devto" ? (
          <>
            <Money label={profile.kind === "twitter" ? "From" : "Upvotes"} value={profile.kind === "twitter" ? profile.developer ?? "X" : formatCount(profile.score)} />
            <Money label="Comments" value={formatCount(profile.comments)} />
            <Money label="Source" value={profile.sourceLabel} />
          </>
        ) : profile.kind === "github" ? (
          <>
            <Money label="Stars" value={formatCount(profile.score)} />
            <Money label="Issues" value={formatCount(profile.comments)} />
            <Money label="Language" value={profile.category ?? "GitHub"} />
          </>
        ) : profile.kind === "firefox" || profile.kind === "appstore" || profile.kind === "playstore" ? (
          <>
            <Money label="Store Rating" value={formatRating(profile.rating)} />
            <Money
              label={profile.kind === "playstore" || profile.kind === "firefox" ? "Users" : "Ratings"}
              value={profile.kind === "appstore" ? formatCount(profile.ratingsCount) : profile.installs ?? formatCount(profile.ratingsCount)}
            />
            <Money label={profile.rank ? "Chart Rank" : "Store"} value={profile.rank ? `#${profile.rank}` : profile.sourceLabel} />
          </>
        ) : (
          <>
            <Money label="Platform" value={profile.sourceLabel} />
            <Money label="Maker" value={profile.developer ?? "—"} />
            <Money label="Category" value={profile.category ?? "Launch"} />
          </>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2 pt-3 border-t border-white/[0.05]">
        <a
          href={profile.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
        >
          <span>View on {profile.sourceLabel}</span>
          <ExternalLink className="size-2.5 text-zinc-500" />
        </a>
        {profile.website && profile.website !== profile.sourceUrl ? (
          <a
            href={profile.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
          >
            <span>Website</span>
            <ExternalLink className="size-2.5 text-zinc-500" />
          </a>
        ) : null}
      </div>
    </section>
  );
}

function GenerateButton({
  busy,
  planReady,
  onClick,
  className,
}: {
  busy: boolean;
  planReady: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(
        "h-9 px-4 text-xs font-medium rounded-lg transition-all",
        planReady
          ? "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08]"
          : "bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm",
        className
      )}
    >
      {busy ? (
        <LoaderCircle className="size-3.5 animate-spin mr-1.5" />
      ) : planReady ? (
        <RefreshCw className="size-3.5 mr-1.5" />
      ) : (
        <Sparkles className="size-3.5 mr-1.5" />
      )}
      <span>{busy ? "Generating..." : planReady ? "Regenerate Blueprint" : "Generate Vibe Blueprint"}</span>
    </Button>
  );
}

function GeneratePanel({ busy, onGenerate, name }: { busy: boolean; onGenerate: () => void; name: string }) {
  return (
    <section id="vibe-plan" className="rounded-xl bg-white/[0.015] border border-white/[0.08] p-6 sm:p-8 text-center relative overflow-hidden">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-zinc-400 bg-white/[0.03] border border-white/[0.06]">
        <Sparkles className="size-3 text-emerald-400" />
        <span>Vibe Engine</span>
      </div>
      <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
        Build {name} with your AI coding agent
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-zinc-400">
        Generates a 27-section master PRD and sequenced prompts covering architecture, schema, features, and deployment.
      </p>
      <div className="mt-5 flex justify-center">
        <Button
          type="button"
          onClick={onGenerate}
          disabled={busy}
          className="h-9.5 px-5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm transition-all"
        >
          {busy ? <LoaderCircle className="size-3.5 animate-spin mr-1.5" /> : <Sparkles className="size-3.5 mr-1.5" />}
          <span>{busy ? "Generating Blueprint..." : "Generate Vibe Blueprint"}</span>
        </Button>
      </div>
    </section>
  );
}

function Money({ label, value, extra }: { label: string; value: string; extra?: string | null }) {
  return (
    <div>
      <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">{label}</p>
      <p className="mt-0.5 font-mono text-sm sm:text-base font-medium tabular-nums text-zinc-200">{value}</p>
      {extra ? <p className="text-[10px] font-mono tabular-nums text-emerald-400">{extra}</p> : null}
    </div>
  );
}

function HitPending() {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Skeleton className="h-5 w-24 rounded-full bg-white/[0.05]" />
        <Skeleton className="mt-3.5 h-8 w-60 rounded-lg bg-white/[0.05]" />
        <Skeleton className="mt-5 h-40 w-full rounded-xl bg-white/[0.04] border border-white/[0.05]" />
        <Skeleton className="mt-5 h-32 w-full rounded-xl bg-white/[0.04] border border-white/[0.05]" />
      </div>
    </div>
  );
}
