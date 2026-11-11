import { useEffect } from "react";
import {
  ArrowUpRight,
  Bot,
  Boxes,
  Cpu,
  FolderKanban,
  Layers,
  Smartphone,
  Sparkles,
  Swords,
  X,
} from "lucide-react";
import { ALL_ECOSYSTEM_LINKS, type EcosystemLinkItem } from "@/lib/all-links-data";
import { useAllLinksModal } from "@/lib/all-links-store";
import { Button } from "@/components/ui/button";

function renderLinkIcon(name: EcosystemLinkItem["iconName"]) {
  switch (name) {
    case "FolderKanban":
      return <FolderKanban className="size-5 text-emerald-400" />;
    case "Bot":
      return <Bot className="size-5 text-emerald-400" />;
    case "Cpu":
      return <Cpu className="size-5 text-emerald-400" />;
    case "Smartphone":
      return <Smartphone className="size-5 text-emerald-400" />;
    case "Boxes":
      return <Boxes className="size-5 text-emerald-400" />;
    case "Swords":
      return <Swords className="size-5 text-emerald-400" />;
    default:
      return <Layers className="size-5 text-emerald-400" />;
  }
}

export function AllLinksModal() {
  const { isOpen, close } = useAllLinksModal();

  // Escape key listener & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-links-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-2xl bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-zinc-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
              <Layers className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="all-links-title" className="text-sm sm:text-base font-semibold tracking-tight text-white">
                  All Ecosystem Links
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {ALL_ECOSYSTEM_LINKS.length} Live Hubs
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Product Factories & Launch Operating Systems
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {ALL_ECOSYSTEM_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 sm:p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="size-10 rounded-lg bg-zinc-900/90 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 group-hover:bg-zinc-800 transition-colors">
                    {renderLinkIcon(item.iconName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <span className="truncate max-w-[280px] sm:max-w-none text-emerald-400/90">
                        {item.url}
                      </span>
                      <span>•</span>
                      <span>{item.stats}</span>
                    </div>
                  </div>
                </div>

                <div className="size-7 rounded-lg bg-white/[0.03] group-hover:bg-emerald-500/10 border border-white/[0.06] group-hover:border-emerald-500/30 flex items-center justify-center text-zinc-500 group-hover:text-emerald-300 shrink-0 transition-all">
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-zinc-900/30 text-xs text-zinc-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="size-3 text-emerald-400 shrink-0" />
            <span>Click any item to open in a new tab</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={close}
            className="h-7 text-xs border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
