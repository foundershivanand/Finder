import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Compass, Download, ExternalLink, FolderKanban, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { PlatformIcon } from "@/components/platform-icons";
import { Button } from "@/components/ui/button";
import { formatUsd, parseHitKey } from "@/lib/format";
import { listSavedBriefs, removeBrief, type SavedBrief } from "@/lib/saved-briefs";
import { pushIdeaToProjectManage, mapOpportunityTag } from "@/lib/project-manage";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

function SavedPage() {
  const [items, setItems] = useState<SavedBrief[]>([]);

  useEffect(() => {
    setItems(listSavedBriefs());
  }, []);

  function exportAll() {
    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finder-saved-blueprints-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/"
          className="mt-6 inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Scout
        </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-emerald-400" />
              <p className="text-[10px] uppercase font-mono tracking-wider text-faint font-semibold">
                Saved Blueprints
              </p>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Your Idea Vault
            </h1>
            <p className="mt-1 text-xs text-muted">
              {items.length === 1 ? "1 saved vibe-code plan" : `${items.length} saved vibe-code plans`} stored on this device.
            </p>
          </div>

          {items.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportAll}
              className="text-xs h-9 border-border bg-card hover:bg-card-2 text-foreground shrink-0"
            >
              <Download className="size-3.5 mr-1.5 text-muted" />
              Export All (.json)
            </Button>
          ) : null}
        </div>

        {/* Product Hub Companion Banner */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <FolderKanban className="size-4 text-emerald-400 shrink-0" />
            <span className="text-foreground">
              Ready to execute these blueprints? Track tasks and launch stages in{" "}
              <strong className="text-emerald-300">Product Hub</strong> (817-task Master Launch OS).
            </span>
          </div>
          <Button asChild size="sm" variant="outline" className="h-8 text-xs shrink-0 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 hover:text-white">
            <a href="https://project-manage-z6u.pages.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
              <span>Open in Product Hub</span>
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-card border border-border/80 p-12 text-center shadow-lg">
            <div className="mx-auto size-12 rounded-2xl bg-card-2 border border-border/70 flex items-center justify-center text-muted">
              <Bookmark className="size-6 text-faint" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">No saved blueprints yet</p>
            <p className="mt-1.5 text-xs text-muted max-w-sm mx-auto leading-relaxed">
              Explore ideas from Reddit, Product Hunt, App Store, Play Store, or TrustMRR, then tap Save on any generated vibe plan.
            </p>
            <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 h-9">
              <Link to="/">
                <Compass className="size-3.5 mr-1.5" />
                Go Scout Ideas
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {items.map((item) => {
              const parsed = parseHitKey(item.brief.slug);
              const kind = item.profile.kind ?? parsed?.kind ?? "trustmrr";
              const id = item.profile.id ?? parsed?.id ?? item.brief.slug;
              return (
                <li
                  key={item.brief.slug}
                  className="rounded-2xl bg-card border border-border/80 p-5 transition-all hover:border-emerald-500/30 hover:bg-card-2 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <PlatformIcon kind={kind} className="size-3.5 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-medium">
                          {kind}
                        </span>
                        <span className="text-[10px] text-faint">•</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {item.brief.vibeGuide?.length ?? 5} steps
                        </span>
                      </div>
                      <h3 className="mt-1 font-semibold text-base text-foreground truncate">
                        {item.brief.productName}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted truncate">
                        Ship <strong className="text-foreground">{item.brief.opportunity.betterName}</strong> — {item.brief.opportunity.positioning}
                      </p>
                      {kind === "trustmrr" && item.profile.revenue?.last30Days ? (
                        <p className="mt-2 font-mono text-[11px] text-emerald-300">
                          {formatUsd(item.profile.revenue.last30Days)} / 30d
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          pushIdeaToProjectManage({
                            name: item.brief.opportunity.betterName || item.brief.productName,
                            description: item.brief.thesis || item.brief.opportunity.positioning || "",
                            url: item.profile.website || `https://finder-d17.pages.dev/hit/${kind}/${id}`,
                            tag: mapOpportunityTag(kind, item.profile.category),
                            status: "idea",
                            source: `Finder (${kind})`,
                            sourceUrl: `https://finder-d17.pages.dev/hit/${kind}/${id}`,
                            blueprint: item.brief.masterBlueprint ?? undefined,
                            vibeGuide: item.brief.vibeGuide?.map((s) => ({
                              step: s.step,
                              title: s.title,
                              why: s.why,
                              prompt: s.prompt,
                              doneWhen: s.doneWhen,
                            })),
                          });
                        }}
                        className="h-9 px-3 text-xs border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50 hover:text-white"
                        title="Push to Project Manage"
                      >
                        <FolderKanban className="size-3.5 mr-1 text-emerald-400" />
                        <span>Push to Project</span>
                      </Button>
                      <Button asChild size="sm" className="h-9 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white">
                        <Link to="/hit/$kind/$id" params={{ kind, id }}>
                          <span>Open Plan</span>
                          <Sparkles className="size-3 ml-1.5" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-9 px-2.5 text-xs text-muted hover:text-rose-400 hover:bg-rose-950/20"
                        onClick={() => setItems(removeBrief(item.brief.slug))}
                        aria-label="Remove"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
