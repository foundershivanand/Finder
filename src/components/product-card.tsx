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
  const painLabel = isAsk ? "Unmet Request" : isStore ? "1-Star Opportunity" : "Market Flank";

  return (
    <Link
      to="/hit/$kind/$id"
      params={{ kind: hit.kind, id: hit.id }}
      className="group relative flex flex-col justify-between rounded-2xl bg-card/90 border border-border/80 p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-card-2 hover:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.06)]"
    >
      <div>
        {/* Top Header: Platform Tag + Title + Arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-6 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-card-2 border border-border/80">
              <PlatformIcon kind={hit.kind} className="size-4 shrink-0" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted truncate">
              {sourceLabel(hit.kind)}
            </span>
            {hit.category ? (
              <span className="text-[11px] text-faint truncate hidden sm:inline">
                • {hit.category}
              </span>
            ) : null}
          </div>

          <div className="size-7 rounded-lg bg-card-2 border border-border/60 flex items-center justify-center text-faint group-hover:text-emerald-400 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/20 transition-all shrink-0">
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Product Identity */}
        <div className="mt-3 flex items-start gap-3">
          <div className="size-11 shrink-0 rounded-xl overflow-hidden bg-card-2 border border-border/80 flex items-center justify-center text-xs font-semibold text-muted">
            {hit.icon && !broken ? (
              <img
                src={hit.icon}
                alt=""
                referrerPolicy="no-referrer"
                className="size-11 object-cover"
                onError={() => setBroken(true)}
              />
            ) : (
              <span className="font-mono">{initials(hit.name)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm sm:text-base font-semibold leading-snug text-foreground group-hover:text-white transition-colors">
              {hit.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {hit.description}
            </p>
          </div>
        </div>

        {/* Highlighted Pain Point / 1-Star Callout */}
        {hit.painPreview ? (
          <div className="mt-3.5 rounded-xl bg-card-2/80 border border-border/60 p-2.5 transition-colors group-hover:border-rose-500/20 group-hover:bg-rose-950/10">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-400/90 font-medium">
              <span className="size-1.5 rounded-full bg-rose-400 shrink-0" />
              {painLabel}
            </div>
            <p className="mt-1 text-xs text-foreground/90 leading-relaxed italic line-clamp-2">
              "{hit.painPreview}"
            </p>
          </div>
        ) : null}
      </div>

      {/* Card Footer: Metrics & Action */}
      <div className="mt-4 pt-3.5 border-t border-border/70 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          {hit.stats.slice(0, 2).map((s) => (
            <div key={s.label}>
              <p className="text-[9px] uppercase tracking-wider font-mono text-faint">{s.label}</p>
              <p className="text-xs font-mono font-semibold text-foreground tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {hit.badges.slice(0, 2).map((b) => (
            <Badge
              key={b}
              variant={b === "Open flank" ? "pain" : moneyTone || b.startsWith("+") ? "money" : "outline"}
              className="text-[10px] py-0 px-2 h-5 font-medium"
            >
              {b}
            </Badge>
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
              "text-[10px] font-medium border rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 transition-all z-10",
              pushed
                ? "text-emerald-200 bg-emerald-800/80 border-emerald-400"
                : "text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30"
            )}
            title="Push to Project Manage"
          >
            {pushed ? <Check className="size-2.5 text-emerald-300" /> : <FolderKanban className="size-2.5" />}
            <span>{pushed ? "Pushed" : "Push"}</span>
          </button>
          <span className="text-[11px] font-medium text-emerald-400 inline-flex items-center gap-0.5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ml-1">
            Build
            <Sparkles className="size-3" />
          </span>
        </div>
      </div>
    </Link>
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
