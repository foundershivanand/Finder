import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, Layers, Sparkles } from "lucide-react";
import { AllLinksButton } from "@/components/all-links-button";
import { Button } from "@/components/ui/button";
import { useAllLinksModal } from "@/lib/all-links-store";

export function AppFooter() {
  const { open } = useAllLinksModal();

  return (
    <footer className="mt-16 border-t border-white/[0.06] bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Unified Companion Ecosystem Card */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.025] p-5 sm:p-6 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-zinc-400 bg-white/[0.03] border border-white/[0.06]">
                <Layers className="size-3 text-emerald-400" />
                <span>Product Factories & Ecosystem</span>
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-semibold tracking-tight text-white">
                5 Product Factories & Launch Operating Systems
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Connect your ideas directly to our full suite: Product Hub (817 launch tasks), Bots Product Factory, AI Agent Factory, Mobile Factory, and the Reusable Code Library.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <CheckCircle2 className="size-2.5 text-emerald-400" /> 5 Live Hubs
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <Sparkles className="size-2.5 text-emerald-400" /> 196+ Total Modules
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <Layers className="size-2.5 text-emerald-400" /> One-Click Access
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                type="button"
                onClick={open}
                className="h-9 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm cursor-pointer"
              >
                <Layers className="size-3.5 mr-1.5 text-zinc-950" />
                <span>All Links (5 Hubs)</span>
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
            <AllLinksButton variant="subtle" label="All Links" />
          </div>
        </div>
      </div>
    </footer>
  );
}
