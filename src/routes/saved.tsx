import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Compass, Download, FolderKanban, Layers, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AllLinksButton } from "@/components/all-links-button";
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
          className="mt-6 inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Scout</span>
        </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="size-3.5 text-emerald-400" />
              <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium">
                Vault
              </p>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Saved Blueprints
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              {items.length === 1 ? "1 saved vibe plan" : `${items.length} saved vibe plans`} stored on this device.
            </p>
          </div>

          {items.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportAll}
              className="text-xs h-8 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 shrink-0"
            >
              <Download className="size-3 mr-1.5 text-zinc-400" />
              Export JSON
            </Button>
          ) : null}
        </div>

        {/* Ecosystem Companion Strip */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] text-xs">
          <div className="flex items-center gap-2.5">
            <Layers className="size-4 text-emerald-400 shrink-0" />
            <span className="text-zinc-300 text-xs leading-relaxed">
              Ready to execute? Access all 6 product factories and launch operating systems in{" "}
              <strong className="text-white font-medium">All Links</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AllLinksButton label="All Links (6 Hubs)" />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
            <div className="mx-auto size-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-500">
              <Bookmark className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-300">No saved blueprints yet</p>
            <p className="mt-1 text-xs text-zinc-500">
              Explore ideas from Reddit, Product Hunt, App Store, Play Store, or TrustMRR, then tap Save on any generated plan.
            </p>
            <Button asChild size="sm" className="mt-5 h-8.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm">
              <Link to="/">
                <Compass className="size-3.5 mr-1.5" />
                <span>Go Scout Ideas</span>
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-5 flex flex-col gap-2.5">
            {items.map((item) => {
              const parsed = parseHitKey(item.brief.slug);
              const kind = item.profile.kind ?? parsed?.kind ?? "trustmrr";
              const id = item.profile.id ?? parsed?.id ?? item.brief.slug;
              return (
                <li
                  key={item.brief.slug}
                  className="rounded-xl bg-card/60 hover:bg-card-2/80 border border-white/[0.06] hover:border-white/[0.14] p-4 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <PlatformIcon kind={kind} className="size-3.5 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                          {kind}
                        </span>
                        <span className="text-zinc-600 text-[10px]">•</span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {item.brief.vibeGuide?.length ?? 5} steps
                        </span>
                      </div>
                      <h3 className="mt-1 font-semibold text-sm text-zinc-100 truncate">
                        {item.brief.productName}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-400 truncate">
                        Ship <span className="text-zinc-200 font-medium">{item.brief.opportunity.betterName}</span> — {item.brief.opportunity.positioning}
                      </p>
                      {kind === "trustmrr" && item.profile.revenue?.last30Days ? (
                        <p className="mt-1.5 font-mono text-[11px] text-zinc-300">
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
                        className="h-8 px-2.5 text-xs border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                        title="Push to Project Manage"
                      >
                        <FolderKanban className="size-3 mr-1 text-zinc-400" />
                        <span>Push</span>
                      </Button>
                      <Button asChild size="sm" className="h-8 px-3 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950">
                        <Link to="/hit/$kind/$id" params={{ kind, id }}>
                          <span>Open Plan</span>
                          <Sparkles className="size-3 ml-1" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20"
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
