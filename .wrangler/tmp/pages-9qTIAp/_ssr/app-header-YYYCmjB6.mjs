import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Compass, a as SquarePlus, c as Share, d as Monitor, h as Download, o as Sparkles, s as Smartphone, t as X, v as Check, y as Bookmark } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-header-YYYCmjB6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-card text-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:text-foreground hover:bg-card",
			outline: "border border-border bg-transparent text-foreground hover:bg-card",
			pain: "bg-pain text-primary-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function usePwaInstall() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(false);
	const [isIos, setIsIos] = (0, import_react.useState)(false);
	const [isStandalone, setIsStandalone] = (0, import_react.useState)(false);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const standaloneCheck = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
		setIsStandalone(standaloneCheck);
		setIsInstalled(standaloneCheck);
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
		setIsIos(isIosDevice);
		const handler = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		window.addEventListener("beforeinstallprompt", handler);
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
		if (deferredPrompt) try {
			await deferredPrompt.prompt();
			if ((await deferredPrompt.userChoice).outcome === "accepted") setIsInstalled(true);
			setDeferredPrompt(null);
		} catch (err) {
			console.warn("PWA prompt error:", err);
			setModalOpen(true);
		}
		else setModalOpen(true);
	}
	return {
		canInstall: !isStandalone,
		isInstalled,
		isIos,
		isStandalone,
		modalOpen,
		setModalOpen,
		promptInstall
	};
}
function PwaInstallButton({ className }) {
	const { isStandalone, isIos, modalOpen, setModalOpen, promptInstall } = usePwaInstall();
	if (isStandalone) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 rounded-full", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), "Installed"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		size: "sm",
		variant: "outline",
		onClick: promptInstall,
		className: cn("relative group inline-flex items-center gap-2 rounded-lg border-border/80 bg-card hover:bg-card-2 hover:border-emerald-500/40 text-foreground text-xs font-medium transition-all shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-emerald-400 group-hover:scale-110 transition-transform" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Install App" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded",
				children: "PWA"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallModal, {
		open: modalOpen,
		onClose: () => setModalOpen(false),
		isIos
	})] });
}
function PwaInstallModal({ open, onClose, isIos }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md rounded-2xl bg-card border border-border/80 p-6 shadow-2xl text-foreground",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card-2 transition-colors",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border border-emerald-500/30 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5 text-emerald-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg text-foreground",
						children: "Install Finder App"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Add to your home screen for quick 1-tap access"
					})] })]
				}),
				isIos ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider font-mono text-faint",
							children: "Safari on iOS Instructions:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold",
								children: "1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs leading-relaxed text-muted",
								children: [
									"Tap the ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "inline size-3.5 text-blue-400" }), " Share"]
									}),
									" button in Safari's bottom toolbar."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold",
								children: "2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs leading-relaxed text-muted",
								children: [
									"Scroll down in the share sheet and tap ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePlus, { className: "inline size-3.5 text-emerald-400" }), " Add to Home Screen"]
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold",
								children: "3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs leading-relaxed text-muted",
								children: [
									"Tap ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: "Add"
									}),
									" in the top right. Finder is now installed on your home screen!"
								]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider font-mono text-faint",
							children: "Android & Desktop (Chrome / Edge / Brave):"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-3 rounded-xl bg-card-2 border border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-7 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border text-emerald-400 font-mono text-xs font-semibold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs leading-relaxed text-muted",
								children: [
									"Look for the ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: "Install App"
									}),
									" icon in your browser's address bar (or browser menu ⋮ > \"Install Finder\" or \"Add to Home Screen\")."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-emerald-200/90",
								children: "Standalone window mode, instant launch, and offline caching support."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onClose,
						variant: "secondary",
						className: "w-full sm:w-auto text-xs",
						children: "Got it"
					})
				})
			]
		})
	});
}
function PwaMobileBanner() {
	const { isStandalone, isIos, promptInstall, modalOpen, setModalOpen } = usePwaInstall();
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("pwa_banner_dismissed")) setDismissed(true);
	}, []);
	if (isStandalone || dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm:hidden fixed bottom-4 left-4 right-4 z-40 p-3.5 rounded-xl bg-card/95 backdrop-blur-md border border-emerald-500/30 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 text-emerald-400" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-foreground truncate",
					children: "Install Finder App"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted truncate",
					children: "One-tap home screen access"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: promptInstall,
				className: "h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg",
				children: "Install"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setDismissed(true);
					sessionStorage.setItem("pwa_banner_dismissed", "1");
				},
				className: "p-1.5 text-muted hover:text-foreground",
				"aria-label": "Dismiss",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallModal, {
		open: modalOpen,
		onClose: () => setModalOpen(false),
		isIos
	})] });
}
var KEY = "riposte.saved.v2";
var LEGACY = "riposte.saved.v1";
function canUse() {
	return typeof window !== "undefined";
}
function readRaw(key) {
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function listSavedBriefs() {
	if (!canUse()) return [];
	const current = readRaw(KEY);
	if (current.length) return current;
	const legacy = readRaw(LEGACY);
	if (!legacy.length) return [];
	const migrated = legacy.map((s) => ({
		...s,
		profile: {
			...s.profile,
			kind: s.profile.kind ?? "trustmrr",
			id: s.profile.id ?? s.brief.slug
		}
	}));
	window.localStorage.setItem(KEY, JSON.stringify(migrated));
	return migrated;
}
function saveBrief(entry) {
	const next = [entry, ...listSavedBriefs().filter((s) => s.brief.slug !== entry.brief.slug)].slice(0, 24);
	window.localStorage.setItem(KEY, JSON.stringify(next));
	return next;
}
function removeBrief(slug) {
	const next = listSavedBriefs().filter((s) => s.brief.slug !== slug);
	window.localStorage.setItem(KEY, JSON.stringify(next));
	return next;
}
function getSavedBrief(slug) {
	return listSavedBriefs().find((s) => s.brief.slug === slug) ?? null;
}
function AppHeader({ className }) {
	const [savedCount, setSavedCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		try {
			const items = listSavedBriefs();
			setSavedCount(items.length);
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: cn("sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 no-underline group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative size-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-emerald-500/40 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "size-4 text-emerald-400",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "9",
								stroke: "currentColor",
								strokeOpacity: "0.4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: "12,5 16,12 12,19 8,12",
								fill: "currentColor",
								fillOpacity: "0.8"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "1.5",
								fill: "#ffffff"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-base sm:text-lg tracking-tight text-foreground group-hover:text-white transition-colors",
						children: "Finder"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-emerald-950/40 text-emerald-400 border border-emerald-800/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400 animate-pulse" }), "VIBE ENGINE"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-2 sm:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "hidden sm:inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted hover:text-foreground rounded-lg hover:bg-card-2 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discover" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/saved",
						className: "inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted hover:text-foreground rounded-lg hover:bg-card-2 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-3.5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saved Plans" }),
							savedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300",
								children: savedCount
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallButton, {})
				]
			})]
		})
	});
}
//#endregion
export { getSavedBrief as a, saveBrief as c, cn as i, usePwaInstall as l, Button as n, listSavedBriefs as o, PwaMobileBanner as r, removeBrief as s, AppHeader as t };
