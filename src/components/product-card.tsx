import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, FolderKanban, Sparkles, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PlatformIcon } from "@/components/platform-icons";
import { Badge } from "@/components/ui/badge";
import { formatGrowth, formatUsd, initials } from "@/lib/format";
import { pushIdeaToProjectManage, mapOpportunityTag } from "@/lib/project-manage";
import type { ScoutHit, ScoutProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: ScoutProduct }) {
  const growth = formatGrowth(product.growth30d);
  const badges = [
    ...(growth ? [growth] : []),
    ...(product.onSale ? ["For sale"] : []),
    ...(product.stealthMode ? ["Stealth"] : []),
  ];
  return (
    <HitCard
      hit={{
        kind: "trustmrr",
        id: product.slug,
        name: product.name,
        description: product.description || "No public description.",
        icon: product.icon,
        category: product.category,
        sourceUrl: product.url,
        stats: [
          { label: "30d Rev", value: formatUsd(product.revenue.last30Days) },
          { label: "MRR", value: formatUsd(product.revenue.mrr) },
        ],
        badges,
        tags: product.sources,
        painPreview: null,
      }}
      moneyTone={product.growth30d > 0}
    />
  );
}

export function HitCard({ hit, moneyTone }: { hit: ScoutHit; moneyTone?: boolean }) {
  const [broken, setBroken] = useState(false);
  const [pushed, setPushed] = useState(false);

  // Distinguish pain point vs ask vs description
  const isAsk = hit.kind === "reddit" || hit.kind === "twitter" || hit.kind === "hackernews";
  const isStore = hit.kind === "appstore" || hit.kind === "playstore";
  const painLabel = isAsk ? "Unmet Request" : isStore ? "1-Star Flank" : "Market Wedge";

  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl bg-card/60 hover:bg-card-2/80 border border-white/[0.06] hover:border-white/[0.14] p-4.5 transition-all duration-200 ease-out hover:-translate-y-0.5 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Clickable Card Overlay */}
      <Link
        to="/hit/$kind/$id"
        params={{ kind: hit.kind, id: hit.id }}
        className="absolute inset-0 z-0 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        aria-label={`View ${hit.name} analysis`}
      />

      {/* Card Content */}
      <div className="relative pointer-events-none z-[1]">
        {/* Top Header: Platform Tag + Title + Arrow */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-5 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-zinc-900 border border-white/[0.08]">
              <PlatformIcon kind={hit.kind} className="size-3.5 shrink-0" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              {sourceLabel(hit.kind)}
            </span>
            {hit.category ? (
              <span className="text-[10px] text-zinc-500 truncate hidden sm:inline">
                • {hit.category}
              </span>
            ) : null}
          </div>

          <div className="size-6 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 group-hover:text-zinc-200 group-hover:border-white/[0.12] transition-all shrink-0">
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Product Identity */}
        <div className="mt-3 flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-zinc-400">
            {hit.icon && !broken ? (
              <img
                src={hit.icon}
                alt=""
                referrerPolicy="no-referrer"
                className="size-10 object-cover"
                onError={() => setBroken(true)}
              />
            ) : (
              <span className="font-mono text-[11px]">{initials(hit.name)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              {hit.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
              {hit.description}
            </p>
          </div>
        </div>

        {/* Highlighted Pain Point / 1-Star Callout */}
        {hit.painPreview ? (
          <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/[0.05] p-2.5 transition-colors group-hover:border-white/[0.09]">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-rose-400/90 font-medium">
              <span className="size-1 rounded-full bg-rose-400 shrink-0" />
              <span>{painLabel}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 leading-relaxed italic line-clamp-2">
              "{hit.painPreview}"
            </p>
          </div>
        ) : null}
      </div>

      {/* Card Footer: Metrics & Action */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2 relative z-10 pointer-events-auto">
        <div className="flex items-center gap-2.5">
          {hit.stats.slice(0, 2).map((s) => (
            <div key={s.label}>
              <p className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">{s.label}</p>
              <p className="text-xs font-mono font-medium text-zinc-200 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {hit.badges.slice(0, 1).map((b) => (
            <span
              key={b}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
            >
              {b}
            </span>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPushed(true);
              setTimeout(() => setPushed(false), 2500);
              pushIdeaToProjectManage({
                name: hit.name,
                description: hit.description,
                url: hit.sourceUrl || `https://finder-d17.pages.dev/hit/${hit.kind}/${hit.id}`,
                tag: mapOpportunityTag(hit.kind, hit.category),
                status: "idea",
                source: `Finder (${hit.kind})`,
                sourceUrl: `https://finder-d17.pages.dev/hit/${hit.kind}/${hit.id}`,
              });
            }}
            className={cn(
              "text-[10px] font-medium border rounded-md px-2 py-0.5 inline-flex items-center gap-1 transition-all",
              pushed
                ? "text-emerald-200 bg-emerald-950/80 border-emerald-500/50"
                : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08]"
            )}
            title="Push to Project Manage"
          >
            {pushed ? <Check className="size-2.5 text-emerald-400" /> : <FolderKanban className="size-2.5 text-zinc-400" />}
            <span>{pushed ? "Pushed" : "Push"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function sourceLabel(kind: ScoutHit["kind"]) {
  const labels: Record<ScoutHit["kind"], string> = {
    trustmrr: "TrustMRR",
    reddit: "Reddit",
    appstore: "App Store",
    playstore: "Google Play",
    producthunt: "Product Hunt",
    twitter: "X / Twitter",
    hackernews: "Hacker News",
    github: "GitHub",
    betalist: "BetaList",
    lobsters: "Lobsters",
    devto: "DEV",
    firefox: "Firefox Add-ons",
    launchingnext: "Launching Next",
  };
  return labels[kind] ?? kind;
}
