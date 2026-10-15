import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, ExternalLink, FolderKanban, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Product Hub Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-card-2 via-card to-background p-6 sm:p-8 shadow-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
                <FolderKanban className="size-3.5 text-emerald-400" />
                <span>Founder Ecosystem Companion</span>
              </div>
              <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Product Hub — 96 Projects & Master Launch OS
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">
                Turn your scouted ideas into shipped products. Track and manage 96 projects through Idea, Working, Done, and Deployed stages with the comprehensive 817-task Master Launch Checklist.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-mono text-muted">
                  <CheckCircle2 className="size-3 text-emerald-400" /> 817-Task Checklist
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-mono text-muted">
                  <Layers className="size-3 text-emerald-400" /> Stage Kanban
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-mono text-muted">
                  <Sparkles className="size-3 text-emerald-400" /> Live on Cloudflare
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                asChild
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-950/50"
              >
                <a
                  href="https://project-manage-z6u.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <FolderKanban className="size-4" />
                  <span>Open Product Hub</span>
                  <ExternalLink className="size-3.5 opacity-80" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Meta Navigation */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Finder</span>
            <span className="text-faint">•</span>
            <span>Startup & App Ideas Vibe Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/" className="hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link to="/saved" className="hover:text-foreground transition-colors">
              Saved Plans
            </Link>
            <a
              href="https://project-manage-z6u.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Product Hub</span>
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
