import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, ExternalLink, FolderKanban, Sparkles } from "lucide-react";
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
        "sticky top-0 z-30 border-b border-white/[0.06] bg-background/75 backdrop-blur-2xl transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          {/* Minimalist Geometric Monogram */}
          <div className="size-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100 group-hover:border-emerald-500/40 group-hover:bg-zinc-800 transition-all">
            <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="8" strokeOpacity="0.3" />
              <path d="M12 4v4m0 8v4M4 12h4m8 0h4" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              Finder
            </span>
            <span className="hidden xs:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
              <span className="size-1 rounded-full bg-emerald-400" />
              <span>INTELLIGENCE</span>
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/"
            className="hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors"
          >
            <Compass className="size-3.5" />
            <span>Discover</span>
          </Link>

          <Link
            to="/saved"
            className="inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors"
          >
            <Bookmark className="size-3.5" />
            <span>Saved</span>
            {savedCount > 0 ? (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-white/[0.08] text-emerald-300">
                {savedCount}
              </span>
            ) : null}
          </Link>

          <a
            href="https://project-manage-z6u.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-all"
            title="Product Hub — 96 Projects & Master Launch OS"
          >
            <FolderKanban className="size-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Product Hub</span>
            <ExternalLink className="size-3 text-zinc-500 group-hover:text-zinc-300" />
          </a>

          <PwaInstallButton />
        </nav>
      </div>
    </header>
  );
}
