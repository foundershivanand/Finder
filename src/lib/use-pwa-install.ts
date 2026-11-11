import { useEffect, useState } from "react";

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
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true);
    setIsStandalone(Boolean(standaloneCheck));
    setIsInstalled(Boolean(standaloneCheck));

    // Detect iOS
    if (typeof window !== "undefined") {
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
    }
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
