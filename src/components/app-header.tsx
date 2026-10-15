import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PwaInstallButton } from "@/components/pwa-install";
import { listSavedBriefs } from "@/lib/saved-briefs";
import { cn } from "@/lib/utils";

export function AppHeader({ className }: { className?: string }) {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    try {
      const items = listSavedBriefs();
      setSavedCount(items.length);
    } catch {
      // ignore
    }
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          {/* Minimalist Logo Icon */}
          <div className="relative size-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-emerald-500/40 transition-colors">
            <svg className="size-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.4" />
              <polygon points="12,5 16,12 12,19 8,12" fill="currentColor" fillOpacity="0.8" />
              <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-foreground group-hover:text-white transition-colors">
              Finder
            </span>
            <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VIBE ENGINE
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted hover:text-foreground rounded-lg hover:bg-card-2 transition-colors"
          >
            <Compass className="size-3.5" />
            <span>Discover</span>
          </Link>

          <Link
            to="/saved"
            className="inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted hover:text-foreground rounded-lg hover:bg-card-2 transition-colors"
          >
            <Bookmark className="size-3.5 text-muted-foreground" />
            <span>Saved Plans</span>
            {savedCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300">
                {savedCount}
              </span>
            ) : null}
          </Link>

          {/* Dedicated Homescreen Install CTA */}
          <PwaInstallButton />
        </nav>
      </div>
    </header>
  );
}
