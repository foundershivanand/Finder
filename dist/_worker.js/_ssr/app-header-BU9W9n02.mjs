import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Bookmark, D as Check, T as Compass, _ as Layers, c as Smartphone, l as Share, o as SquarePlus, p as Monitor, s as Sparkles, t as X, x as Download } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-header-BU9W9n02.js
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
		const standaloneCheck = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true);
		setIsStandalone(Boolean(standaloneCheck));
		setIsInstalled(Boolean(standaloneCheck));
		if (typeof window !== "undefined") {
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
		}
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
var useAllLinksModal = create((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}));
var ALL_ECOSYSTEM_LINKS = [
	{
		id: "product-manage",
		title: "Product Hub",
		badge: "Launch OS",
		tagline: "Master Launch Operating System",
		description: "Turn scouted ideas into live products with 817-task launch checklists, Kanban stage tracking, and shared Turso cloud sync.",
		url: "https://project-manage-z6u.pages.dev/",
		iconName: "FolderKanban",
		stats: "96 Projects • 817 Tasks"
	},
	{
		id: "botserusable",
		title: "Bots Product Factory",
		badge: "Bot Factory",
		tagline: "Reusable Bot Code Library",
		description: "Production bot templates and integration modules for Telegram, Discord, Slack, and WhatsApp with conversational workflows.",
		url: "https://botserusable.pages.dev/",
		iconName: "Bot",
		stats: "Multi-Platform • Webhooks"
	},
	{
		id: "agentsreusable",
		title: "AI Agent Product Factory",
		badge: "Agent Factory",
		tagline: "Autonomous Agent Architecture",
		description: "Modular AI agent scaffolding, tool execution runtimes, long-term memory, prompt injection defenses, and multi-agent orchestration.",
		url: "https://agentsreusable.pages.dev/",
		iconName: "Cpu",
		stats: "Tool Calling • Agent Memory"
	},
	{
		id: "appreusable",
		title: "Mobile Product Factory",
		badge: "Mobile Factory",
		tagline: "163 Mobile Architecture Modules",
		description: "Production-ready mobile architecture for React Native, Flutter, iOS, and Android with offline-first sync engines and native bridges.",
		url: "https://appreusable.pages.dev/",
		iconName: "Smartphone",
		stats: "163 Modules • iOS & Android"
	},
	{
		id: "reusable-library",
		title: "Reusable Code Library",
		badge: "Web & Backend",
		tagline: "33 Enterprise-Grade Modules",
		description: "33 battle-tested modules (OAuth, Stripe subscriptions, Turso DB, rate limiting, audit logging) ready for autonomous AI coding agents.",
		url: "https://reusable-library.foundershivanand.workers.dev/",
		iconName: "Boxes",
		stats: "33 Modules • AI Agent Ready"
	},
	{
		id: "mentor-api",
		title: "AI Mentor OS",
		badge: "Mentor OS",
		tagline: "Ruthless Socratic Sparring & 15 Skills",
		description: "Adversarial practice arena, 15-skill mastery taxonomy, vocal defense grading, training debt ledger, and physical reality mode operations.",
		url: "https://mentor-api.foundershivanand.workers.dev/",
		iconName: "Swords",
		stats: "15 Skills • Voice Sparring • Turso Sync"
	}
];
function AllLinksButton({ className, variant = "default", label = "All Links" }) {
	const { open } = useAllLinksModal();
	const count = ALL_ECOSYSTEM_LINKS.length;
	if (variant === "pill") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: open,
		className: cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-emerald-500/[0.06] hover:bg-emerald-500/[0.14] text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer group shadow-sm", className),
		title: `View All ${count} Ecosystem Links & Factories`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3 text-emerald-400 group-hover:rotate-6 transition-transform" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-emerald-400 animate-pulse" })
		]
	});
	if (variant === "subtle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: open,
		className: cn("text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer", className),
		title: `View All ${count} Ecosystem Links`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: open,
		className: cn("inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-all cursor-pointer group", className),
		title: "All Ecosystem Links & Product Factories",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-emerald-400 group-hover:scale-105 transition-transform" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-1 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-zinc-400 group-hover:text-emerald-300",
				children: count
			})
		]
	});
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
		className: cn("sticky top-0 z-30 border-b border-white/[0.06] bg-background/75 backdrop-blur-2xl transition-all", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-13 max-w-6xl items-center justify-between px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 no-underline group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100 group-hover:border-emerald-500/40 group-hover:bg-zinc-800 transition-all",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "size-3.5 text-emerald-400",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "8",
								strokeOpacity: "0.3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 4v4m0 8v4M4 12h4m8 0h4",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "1.5",
								fill: "currentColor"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-sm sm:text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors",
						children: "Finder"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden xs:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INTELLIGENCE" })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1.5 sm:gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "hidden sm:inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discover" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/saved",
						className: "inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saved" }),
							savedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-white/[0.08] text-emerald-300",
								children: savedCount
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllLinksButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallButton, {})
				]
			})]
		})
	});
}
//#endregion
export { PwaMobileBanner as a, listSavedBriefs as c, useAllLinksModal as d, Button as i, removeBrief as l, AllLinksButton as n, cn as o, AppHeader as r, getSavedBrief as s, ALL_ECOSYSTEM_LINKS as t, saveBrief as u };
