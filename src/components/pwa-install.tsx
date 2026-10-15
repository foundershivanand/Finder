import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, Smartphone, Check, X, Sparkles, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const standaloneCheck =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standaloneCheck);
    setIsInstalled(standaloneCheck);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture beforeinstallprompt for Chrome / Edge / Android
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for appinstalled
    const installedHandler = () => {
      setIsInstalled(true);
      setIsStandalone(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  async function promptInstall() {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn("PWA prompt error:", err);
        setModalOpen(true);
      }
    } else {
      // Fallback for iOS or already installed or desktop browser without direct prompt
      setModalOpen(true);
    }
  }

  return {
    canInstall: !isStandalone,
    isInstalled,
    isIos,
    isStandalone,
    modalOpen,
    setModalOpen,
    promptInstall,
  };
}

export function PwaInstallButton({ className }: { className?: string }) {
  const { isStandalone, isIos, modalOpen, setModalOpen, promptInstall } = usePwaInstall();

  if (isStandalone) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 rounded-full", className)}>
        <Check className="size-3.5" />
        Installed
      </span>
    );
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={promptInstall}
        className={cn(
          "relative group inline-flex items-center gap-2 rounded-lg border-border/80 bg-card hover:bg-card-2 hover:border-emerald-500/40 text-foreground text-xs font-medium transition-all shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          className
        )}
      >
        <Download className="size-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span>Install App</span>
        <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded">
          PWA
        </span>
      </Button>

      <PwaInstallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isIos={isIos}
      />
    </>
  );
}

export function PwaInstallModal({
  open,
  onClose,
  isIos,
}: {
  open: boolean;
  onClose: () => void;
  isIos: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-card border border-border/80 p-6 shadow-2xl text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card-2 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Smartphone className="size-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Install Finder App</h3>
            <p className="text-xs text-muted">Add to your home screen for quick 1-tap access</p>
          </div>
        </div>

        {isIos ? (
          <div className="mt-6 space-y-3.5 text-sm">
            <p className="text-xs uppercase tracking-wider font-mono text-faint">
              Safari on iOS Instructions:
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60">
              <div className="size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold">
                1
              </div>
              <div className="text-xs leading-relaxed text-muted">
                Tap the <strong className="text-foreground inline-flex items-center gap-1"><Share className="inline size-3.5 text-blue-400" /> Share</strong> button in Safari's bottom toolbar.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60">
              <div className="size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold">
                2
              </div>
              <div className="text-xs leading-relaxed text-muted">
                Scroll down in the share sheet and tap <strong className="text-foreground inline-flex items-center gap-1"><PlusSquare className="inline size-3.5 text-emerald-400" /> Add to Home Screen</strong>.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60">
              <div className="size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold">
                3
              </div>
              <div className="text-xs leading-relaxed text-muted">
                Tap <strong className="text-foreground">Add</strong> in the top right. Finder is now installed on your home screen!
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3.5 text-sm">
            <p className="text-xs uppercase tracking-wider font-mono text-faint">
              Android & Desktop (Chrome / Edge / Brave):
            </p>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60">
              <div className="size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold">
                <Monitor className="size-3.5" />
              </div>
              <div className="text-xs leading-relaxed text-muted">
                Look for the <strong className="text-foreground">Install App</strong> icon in your browser's address bar (or browser menu ⋮ &gt; "Install Finder" or "Add to Home Screen").
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-center gap-2.5">
              <Sparkles className="size-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200/90">
                Standalone window mode, instant launch, and offline caching support.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto text-xs">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PwaMobileBanner() {
  const { isStandalone, isIos, promptInstall, modalOpen, setModalOpen } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("pwa_banner_dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  if (isStandalone || dismissed) return null;

  return (
    <>
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 p-3.5 rounded-xl bg-card/95 backdrop-blur-md border border-emerald-500/30 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Download className="size-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Install Finder App</p>
            <p className="text-[11px] text-muted truncate">One-tap home screen access</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={promptInstall}
            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg"
          >
            Install
          </Button>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem("pwa_banner_dismissed", "1");
            }}
            className="p-1.5 text-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <PwaInstallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isIos={isIos}
      />
    </>
  );
}
