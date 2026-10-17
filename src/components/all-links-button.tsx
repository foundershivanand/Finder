import { Layers } from "lucide-react";
import { useAllLinksModal } from "@/lib/all-links-store";
import { cn } from "@/lib/utils";

export function AllLinksButton({
  className,
  variant = "default",
  label = "All Links",
}: {
  className?: string;
  variant?: "default" | "pill" | "subtle";
  label?: string;
}) {
  const { open } = useAllLinksModal();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={open}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-emerald-500/[0.06] hover:bg-emerald-500/[0.14] text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer group shadow-sm",
          className
        )}
        title="View All 5 Ecosystem Links & Factories"
      >
        <Layers className="size-3 text-emerald-400 group-hover:rotate-6 transition-transform" />
        <span>{label}</span>
        <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  if (variant === "subtle") {
    return (
      <button
        type="button"
        onClick={open}
        className={cn(
          "text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer",
          className
        )}
        title="View All 5 Ecosystem Links"
      >
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-all cursor-pointer group",
        className
      )}
      title="All Ecosystem Links & Product Factories"
    >
      <Layers className="size-3.5 text-emerald-400 group-hover:scale-105 transition-transform" />
      <span>{label}</span>
      <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-zinc-400 group-hover:text-emerald-300">
        5
      </span>
    </button>
  );
}
