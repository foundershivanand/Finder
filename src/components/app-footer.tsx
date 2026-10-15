import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, ExternalLink, FolderKanban, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-white/[0.06] bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Product Hub Companion Card */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.025] p-5 sm:p-6 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-zinc-400 bg-white/[0.03] border border-white/[0.06]">
                <FolderKanban className="size-3 text-emerald-400" />
                <span>Companion OS</span>
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-semibold tracking-tight text-white">
                Product Hub — 96 Projects & Master Launch OS
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Turn scouted ideas into live products with 817-task launch checklists, Kanban stage tracking, and shared Turso cloud sync.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <CheckCircle2 className="size-2.5 text-emerald-400" /> 817 Tasks
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <Layers className="size-2.5 text-emerald-400" /> Stage Kanban
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <Sparkles className="size-2.5 text-emerald-400" /> Cloudflare Edge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                asChild
                className="h-9 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm"
              >
                <a
                  href="https://project-manage-z6u.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  <FolderKanban className="size-3.5" />
                  <span>Open Product Hub</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Meta Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.05] pt-5 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400">Finder</span>
            <span className="text-zinc-700">•</span>
            <span className="text-[11px]">Real-Time Startup Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
              Discover
            </Link>
            <Link to="/saved" className="text-zinc-400 hover:text-white transition-colors">
              Saved
            </Link>
            <a
              href="https://project-manage-z6u.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Product Hub</span>
              <ArrowUpRight className="size-3 text-zinc-600" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
