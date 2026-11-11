import { r as __toESM } from "../_runtime.mjs";
import { a as formatUsd, r as formatGrowth, s as initials, t as extractHitRef } from "./format-xEnlTVnE.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ArrowUpRight, E as Boxes, T as Check, _ as Funnel, j as ArrowRight, t as X, u as Search, v as FolderKanban, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as cn, l as usePwaInstall, n as Button, t as AppHeader } from "./app-header---E76V9W.mjs";
import { a as Skeleton, i as Route$3, o as fetchDesk } from "./router-C59lck4j.mjs";
import { i as pushIdeaToProjectManage, n as PlatformIcon, r as mapOpportunityTag, t as AppFooter } from "./platform-icons-238j9NXI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-M8rnWKXq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const growth = formatGrowth(product.growth30d);
	const badges = [
		...growth ? [growth] : [],
		...product.onSale ? ["For sale"] : [],
		...product.stealthMode ? ["Stealth"] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitCard, {
		hit: {
			kind: "trustmrr",
			id: product.slug,
			name: product.name,
			description: product.description || "No public description.",
			icon: product.icon,
			category: product.category,
			sourceUrl: product.url,
			stats: [{
				label: "30d Rev",
				value: formatUsd(product.revenue.last30Days)
			}, {
				label: "MRR",
				value: formatUsd(product.revenue.mrr)
			}],
			badges,
			tags: product.sources,
			painPreview: null
		},
		moneyTone: product.growth30d > 0
	});
}
function HitCard({ hit, moneyTone }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	const [pushed, setPushed] = (0, import_react.useState)(false);
	const isAsk = hit.kind === "reddit" || hit.kind === "twitter" || hit.kind === "hackernews";
	const isStore = hit.kind === "appstore" || hit.kind === "playstore";
	const painLabel = isAsk ? "Unmet Request" : isStore ? "1-Star Flank" : "Market Wedge";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col justify-between rounded-xl bg-card/60 hover:bg-card-2/80 border border-white/[0.06] hover:border-white/[0.14] p-4.5 transition-all duration-200 ease-out hover:-translate-y-0.5 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/hit/$kind/$id",
				params: {
					kind: hit.kind,
					id: hit.id
				},
				className: "absolute inset-0 z-0 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/40",
				"aria-label": `View ${hit.name} analysis`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative pointer-events-none z-[1]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-5 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-zinc-900 border border-white/[0.08]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformIcon, {
										kind: hit.kind,
										className: "size-3.5 shrink-0"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate",
									children: sourceLabel(hit.kind)
								}),
								hit.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-zinc-500 truncate hidden sm:inline",
									children: ["• ", hit.category]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-6 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 group-hover:text-zinc-200 group-hover:border-white/[0.12] transition-all shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-10 shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-zinc-400",
							children: hit.icon && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: hit.icon,
								alt: "",
								referrerPolicy: "no-referrer",
								className: "size-10 object-cover",
								onError: () => setBroken(true)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px]",
								children: initials(hit.name)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "line-clamp-1 text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors",
								children: hit.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400",
								children: hit.description
							})]
						})]
					}),
					hit.painPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg bg-white/[0.02] border border-white/[0.05] p-2.5 transition-colors group-hover:border-white/[0.09]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-rose-400/90 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: painLabel })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-zinc-300 leading-relaxed italic line-clamp-2",
							children: [
								"\"",
								hit.painPreview,
								"\""
							]
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3.5 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2 relative z-10 pointer-events-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2.5",
					children: hit.stats.slice(0, 2).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] uppercase tracking-wider font-mono text-zinc-500",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono font-medium text-zinc-200 tabular-nums",
						children: s.value
					})] }, s.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [hit.badges.slice(0, 1).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
						children: b
					}, b)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: (e) => {
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
								sourceUrl: `https://finder-d17.pages.dev/hit/${hit.kind}/${hit.id}`
							});
						},
						className: cn("text-[10px] font-medium border rounded-md px-2 py-0.5 inline-flex items-center gap-1 transition-all", pushed ? "text-emerald-200 bg-emerald-950/80 border-emerald-500/50" : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08]"),
						title: "Push to Project Manage",
						children: [pushed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-2.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-2.5 text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pushed ? "Pushed" : "Push" })]
					})]
				})]
			})
		]
	});
}
function sourceLabel(kind) {
	return {
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
		launchingnext: "Launching Next"
	}[kind] ?? kind;
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-faint", "transition-[box-shadow,border-color] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70", className),
		...props
	});
}
var PRIMARY_DESKS = [
	{
		id: "reddit",
		label: "Reddit",
		hint: "Unmet requests & app ideas from r/SomebodyMakeThis, r/AppIdeas, and r/SaaS"
	},
	{
		id: "producthunt",
		label: "Product Hunt",
		hint: "Today’s product launches — comment feedback is the spec"
	},
	{
		id: "appstore",
		label: "App Store",
		hint: "Top grossing iOS apps — read 1-star reviews to find open flanks"
	},
	{
		id: "playstore",
		label: "Play Store",
		hint: "Android hits you can beat with a faster, cleaner first-run"
	},
	{
		id: "trustmrr",
		label: "TrustMRR",
		hint: "Verified MRR & revenue — clone what already converts and sells"
	},
	{
		id: "twitter",
		label: "Twitter / X",
		hint: "Live asks: 'I wish there was an app that...' and founder complaints"
	}
];
var OTHER_DESKS = [
	{
		id: "hackernews",
		label: "Hacker News",
		hint: "Show HN and Ask HN launches with brutal developer feedback"
	},
	{
		id: "github",
		label: "GitHub",
		hint: "Trending repos whose issue trackers are product opportunity specs"
	},
	{
		id: "betalist",
		label: "BetaList",
		hint: "Startups still in beta where you can beat their launch"
	},
	{
		id: "lobsters",
		label: "Lobsters",
		hint: "Builder discussions with technical pain points"
	},
	{
		id: "devto",
		label: "DEV",
		hint: "Showdev and side projects seeking cleaner alternatives"
	},
	{
		id: "firefox",
		label: "Firefox",
		hint: "Add-ons with users and ratings you can surpass"
	},
	{
		id: "launchingnext",
		label: "Launching Next",
		hint: "Newest startups and trending side projects"
	}
];
var ALL_DESKS = [...PRIMARY_DESKS, ...OTHER_DESKS];
var TMRR_TABS = [
	{
		id: "earning",
		label: "Earning well",
		hint: "$500+ in 30 days or $200+ MRR"
	},
	{
		id: "growing",
		label: "Growing fast",
		hint: "Highest 30-day revenue growth"
	},
	{
		id: "recent",
		label: "Just listed",
		hint: "Newest startups on TrustMRR"
	},
	{
		id: "listed",
		label: "For sale",
		hint: "Acquisition listings with verified metrics"
	}
];
function Home() {
	const feed = Route$3.useLoaderData();
	const navigate = useNavigate();
	const [desk, setDesk] = (0, import_react.useState)("trustmrr");
	const [tmrrTab, setTmrrTab] = (0, import_react.useState)("earning");
	const [query, setQuery] = (0, import_react.useState)("");
	const [lookupError, setLookupError] = (0, import_react.useState)(null);
	const [deskHits, setDeskHits] = (0, import_react.useState)({});
	const [deskError, setDeskError] = (0, import_react.useState)({});
	const [deskLoading, setDeskLoading] = (0, import_react.useState)({});
	const requested = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const { isStandalone } = usePwaInstall();
	(0, import_react.useEffect)(() => {
		if (desk === "trustmrr") return;
		if (requested.current.has(desk)) return;
		requested.current.add(desk);
		setDeskLoading((s) => ({
			...s,
			[desk]: true
		}));
		fetchDesk({ data: { kind: desk } }).then((res) => {
			setDeskHits((s) => ({
				...s,
				[desk]: res.hits
			}));
			if (res.error) setDeskError((s) => ({
				...s,
				[desk]: res.error
			}));
		}).catch((err) => {
			requested.current.delete(desk);
			setDeskHits((s) => ({
				...s,
				[desk]: []
			}));
			setDeskError((s) => ({
				...s,
				[desk]: err instanceof Error ? err.message : "Could not load this desk"
			}));
		}).finally(() => {
			setDeskLoading((s) => ({
				...s,
				[desk]: false
			}));
		});
	}, [desk]);
	const tmrrProducts = feed[tmrrTab];
	const hits = deskHits[desk] ?? [];
	const filteredTmrr = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return tmrrProducts;
		return tmrrProducts.filter((p) => {
			return p.name.toLowerCase().includes(q) || p.slug.includes(q) || (p.category ?? "").toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
		});
	}, [tmrrProducts, query]);
	const filteredHits = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return hits;
		return hits.filter((h) => {
			return h.name.toLowerCase().includes(q) || h.id.toLowerCase().includes(q) || (h.category ?? "").toLowerCase().includes(q) || h.description.toLowerCase().includes(q) || h.badges.some((b) => b.toLowerCase().includes(q));
		});
	}, [hits, query]);
	function onLookup(e) {
		e.preventDefault();
		const hit = extractHitRef(query);
		if (hit) {
			setLookupError(null);
			navigate({
				to: "/hit/$kind/$id",
				params: {
					kind: hit.kind,
					id: hit.id
				}
			});
			return;
		}
		if (desk === "trustmrr" && filteredTmrr.length === 1) {
			setLookupError(null);
			navigate({
				to: "/hit/$kind/$id",
				params: {
					kind: "trustmrr",
					id: filteredTmrr[0].slug
				}
			});
			return;
		}
		if (desk !== "trustmrr" && filteredHits.length === 1) {
			setLookupError(null);
			navigate({
				to: "/hit/$kind/$id",
				params: {
					kind: filteredHits[0].kind,
					id: filteredHits[0].id
				}
			});
			return;
		}
		if (query.trim() && (desk === "trustmrr" && filteredTmrr.length === 0 || desk !== "trustmrr" && filteredHits.length === 0)) setLookupError("No match in this desk. Paste a TrustMRR, store, Reddit, Product Hunt, GitHub, or X URL.");
		else setLookupError(null);
	}
	const count = desk === "trustmrr" ? feed.earning.length : deskLoading[desk] && !deskHits[desk] ? 0 : hits.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-24 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
						desk,
						count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onLookup,
						className: "mt-6 relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-2 p-1 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-white/[0.16] focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20 backdrop-blur-xl transition-all shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 flex items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 size-4 text-zinc-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (e) => {
											setQuery(e.target.value);
											setLookupError(null);
										},
										placeholder: "Search ideas, or paste any Reddit / Product Hunt / App Store / Play Store / TrustMRR URL...",
										className: "pl-9 pr-8 border-0 bg-transparent focus-visible:ring-0 text-xs sm:text-sm h-9.5 text-zinc-100 placeholder:text-zinc-500",
										"aria-label": "Search opportunities"
									}),
									query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuery(""),
										className: "absolute right-2.5 p-1 rounded-md text-zinc-500 hover:text-zinc-200",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "h-9.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs sm:w-auto shrink-0 transition-colors shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analyze & Build" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3 ml-1" })]
							})]
						}), lookupError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-rose-400 pl-1",
							children: lookupError
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-mono uppercase tracking-wider text-zinc-400",
										children: "Channels"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-mono text-zinc-600",
									children: [ALL_DESKS.length, " live desks"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 pt-0.5",
								children: PRIMARY_DESKS.map((d) => {
									const active = desk === d.id;
									const hitCount = d.id === "trustmrr" ? feed.earning.length : deskHits[d.id]?.length ?? (deskLoading[d.id] ? "…" : "—");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setDesk(d.id),
										className: cn("flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-all group", active ? "bg-white/[0.08] border-white/20 text-white shadow-sm" : "bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] hover:border-white/[0.10]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformIcon, {
												kind: d.id,
												className: "size-3.5 shrink-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-xs",
												children: d.label
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] font-mono px-1 py-0.2 rounded tabular-nums shrink-0", active ? "bg-white/[0.12] text-white font-medium" : "text-zinc-600"),
											children: hitCount
										})]
									}, d.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider font-mono text-zinc-600 px-1 shrink-0",
									children: "More:"
								}), OTHER_DESKS.map((d) => {
									const active = desk === d.id;
									const hitCount = deskHits[d.id]?.length ?? (deskLoading[d.id] ? "…" : "—");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setDesk(d.id),
										className: cn("h-7 shrink-0 rounded-md px-2 text-[11px] inline-flex items-center gap-1.5 border transition-all", active ? "bg-white/[0.08] border-white/20 text-white font-medium" : "bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformIcon, {
												kind: d.id,
												className: "size-3 shrink-0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.label }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[9px] text-zinc-600 tabular-nums",
												children: hitCount
											})
										]
									}, d.id);
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 flex items-center justify-between text-xs text-zinc-500 px-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-1",
							children: ALL_DESKS.find((d) => d.id === desk)?.hint
						}), deskLoading[desk] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-400 font-mono text-[10px] shrink-0 ml-2",
							children: "Syncing..."
						}) : null]
					}),
					deskError[desk] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-rose-400",
						children: deskError[desk]
					}) : null,
					desk === "trustmrr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-x-auto",
							children: TMRR_TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTmrrTab(t.id),
								className: cn("h-8 shrink-0 rounded-lg px-3 text-xs font-medium transition-all inline-flex items-center gap-1.5", tmrrTab === t.id ? "bg-white/[0.08] text-white border border-white/10 shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-zinc-500 tabular-nums",
									children: feed[t.id].length
								})]
							}, t.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: filteredTmrr })]
					}) : deskLoading[desk] && !deskHits[desk] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-xl bg-card border border-white/[0.05]" }, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitGrid, {
						hits: filteredHits,
						empty: emptyCopy(desk)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFooter, {})
		]
	});
}
function emptyCopy(desk) {
	return {
		reddit: "Reddit desk is updating. Try Product Hunt, App Store, or Twitter.",
		producthunt: "Product Hunt feed was quiet. Try Hacker News, Reddit, or App Store.",
		appstore: "The App Store chart was quiet. Try Google Play or TrustMRR.",
		playstore: "The Play Store chart was quiet. Try App Store or Reddit.",
		trustmrr: "No products matched this filter. Try another tab.",
		twitter: "Twitter search is refreshing. Try Reddit or Hacker News.",
		hackernews: "Hacker News did not return stories. Try GitHub or Product Hunt.",
		github: "GitHub search was quiet. Try Launching Next.",
		betalist: "BetaList had no launches right now. Try Product Hunt.",
		lobsters: "Lobsters was empty. Try Hacker News.",
		devto: "DEV had no showdev posts. Try GitHub.",
		firefox: "Firefox add-ons did not load. Try Play Store.",
		launchingnext: "Launching Next was quiet. Try BetaList."
	}[desk] ?? "This desk is quiet. Try another source.";
}
function Hero({ desk, count }) {
	const copy = heroCopy(desk, count);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pt-6 sm:pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-white/[0.03] text-zinc-400 border border-white/[0.06]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-200",
							children: copy.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-600",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.badge })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://reusable-library.foundershivanand.workers.dev/",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide bg-emerald-500/[0.05] hover:bg-emerald-500/[0.12] text-emerald-300 border border-emerald-500/20 transition-all group",
					title: "Personal Product Factory — 33 Reusable Code Modules ready for AI agents",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-3 text-emerald-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "33 Reusable Modules" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-2.5 opacity-60 group-hover:opacity-100 transition-opacity" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-3.5 max-w-3xl text-2xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-white leading-[1.15]",
				children: [
					copy.title[0],
					" ",
					copy.title[1],
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-zinc-400 font-normal",
						children: copy.title[2]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-400",
				children: copy.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4.5 flex flex-wrap items-center gap-2 sm:gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-mono uppercase tracking-wider text-zinc-500",
					children: "Playbook:"
				}), copy.steps.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-zinc-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-zinc-500",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-xs",
							children: s.t
						}),
						idx < copy.steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-700 ml-1",
							children: "→"
						}) : null
					]
				}, s.n))]
			})
		]
	});
}
function heroCopy(desk, count) {
	return {
		reddit: {
			kicker: "Reddit Desk",
			title: [
				"Unmet requests.",
				"Ready buyers.",
				"Vibe-code the antidote."
			],
			body: "Finder scouts r/SomebodyMakeThis, r/AppIdeas, and r/SaaS threads where real users ask for a product. Tap any idea to get a copy-paste vibe-coding plan.",
			badge: `${count} live asks`,
			live: "Live from Reddit",
			steps: [
				{
					n: "01",
					t: "Scout the ask",
					d: "Threads where buyers describe their missing software."
				},
				{
					n: "02",
					t: "Extract the spec",
					d: "Post details and top comments become acceptance criteria."
				},
				{
					n: "03",
					t: "Vibe-code the build",
					d: "Step-by-step prompts ready for Cursor, Grok, or Claude."
				}
			]
		},
		producthunt: {
			kicker: "Product Hunt Desk",
			title: [
				"Today’s launches.",
				"Fresh demand.",
				"Ship the sharper version."
			],
			body: "Discover newly launched products on Product Hunt. Read positioning gaps and comments, then generate a vibe-coding blueprint to beat them.",
			badge: `${count} launches`,
			live: "Live from Product Hunt",
			steps: [
				{
					n: "01",
					t: "Scout fresh hunts",
					d: "Products gaining initial traction right now."
				},
				{
					n: "02",
					t: "Find the hole",
					d: "Analyze taglines and maker gaps to find your wedge."
				},
				{
					n: "03",
					t: "Vibe-code it",
					d: "A 27-section master PRD plus sequenced prompts."
				}
			]
		},
		appstore: {
			kicker: "App Store Desk",
			title: [
				"Charting iOS apps.",
				"1-star gold.",
				"Ship the cleaner alternative."
			],
			body: "Top grossing and paid iOS apps filtered by rating vulnerabilities. Open any app to mine the negative reviews and generate a vibe-code plan.",
			badge: `${count} iOS targets`,
			live: "Live from Apple App Store",
			steps: [
				{
					n: "01",
					t: "Scout the charts",
					d: "Apps with proven distribution and user volume."
				},
				{
					n: "02",
					t: "Mine the 1-stars",
					d: "Extract repeated bugs, paywalls, and feature gaps."
				},
				{
					n: "03",
					t: "Vibe-code the fix",
					d: "Build the app that makes those 1-star complaints impossible."
				}
			]
		},
		playstore: {
			kicker: "Play Store Desk",
			title: [
				"Android hits.",
				"Open flanks.",
				"A week to a better first run."
			],
			body: "Charting Google Play apps in productivity, tools, and business with beatable ratings. We surface the ones leaving users frustrated.",
			badge: `${count} Android targets`,
			live: "Live from Google Play",
			steps: [
				{
					n: "01",
					t: "Scout top installs",
					d: "High-volume apps that users already search for."
				},
				{
					n: "02",
					t: "Read user grievances",
					d: "Ads, crashes, complicated UX — the exact wedge."
				},
				{
					n: "03",
					t: "Vibe-code the fix",
					d: "A sequenced build prompt focused on instant value."
				}
			]
		},
		twitter: {
			kicker: "Twitter / X Desk",
			title: [
				"People typing the ask.",
				"In public, on X.",
				"Ship before the thread cools."
			],
			body: "Live posts: “I wish there was an app”, “someone should make”, and build-in-public pain points. The tweet thread is your product spec.",
			badge: `${count} asks`,
			live: "Live from X",
			steps: [
				{
					n: "01",
					t: "Scout the asks",
					d: "Tweets where buyers explicitly state their willingness to pay."
				},
				{
					n: "02",
					t: "Read the thread",
					d: "Direct complaints and replies form your feature backlog."
				},
				{
					n: "03",
					t: "Vibe-code it",
					d: "Paste the prompts. Reply with a working product, not a waitlist."
				}
			]
		},
		trustmrr: trustHero(count),
		hackernews: {
			kicker: "Hacker News Desk",
			title: [
				"Show HN.",
				"Ask HN.",
				"The comment section is your QA."
			],
			body: "Technical launches and requests with honest discussion. Open a story, inspect the criticism, and generate a plan that survives HN critique.",
			badge: `${count} stories`,
			live: "Live from Hacker News",
			steps: [
				{
					n: "01",
					t: "Scout Show & Ask",
					d: "Projects with organic community discussions."
				},
				{
					n: "02",
					t: "Read the feedback",
					d: "Top comments tell you exactly why competitors fail."
				},
				{
					n: "03",
					t: "Vibe-code the fix",
					d: "A bulletproof architecture tailored to those lessons."
				}
			]
		},
		github: {
			kicker: "GitHub Desk",
			title: [
				"Starred repos.",
				"Issue backlogs.",
				"A SaaS hiding in the tracker."
			],
			body: "High-growth open-source repositories whose issue trackers describe the missing commercial cloud product.",
			badge: `${count} repos`,
			live: "Live from GitHub",
			steps: [
				{
					n: "01",
					t: "Scout stars & growth",
					d: "Projects with real developer adoption."
				},
				{
					n: "02",
					t: "Read the issues",
					d: "Unresolved feature requests are user demand."
				},
				{
					n: "03",
					t: "Vibe-code it",
					d: "Build a polished commercial product, not a clone."
				}
			]
		},
		betalist: {
			kicker: "BetaList Desk",
			title: [
				"Still in beta.",
				"Still clumsy.",
				"Beat them to market."
			],
			body: "Startups on BetaList — early enough that a sharper first-run can capture the market cohort.",
			badge: `${count} betas`,
			live: "Live from BetaList",
			steps: [
				{
					n: "01",
					t: "Scout new betas",
					d: "Early startups introducing their concept."
				},
				{
					n: "02",
					t: "Spot the weakness",
					d: "Compare their tagline with their onboarding."
				},
				{
					n: "03",
					t: "Vibe-code it",
					d: "Ship the clean version they intended to build."
				}
			]
		}
	}[desk] ?? trustHero(count);
}
function trustHero(count) {
	return {
		kicker: "TrustMRR Desk",
		title: [
			"Find what’s earning.",
			"Steal the pain.",
			"Vibe-code it better."
		],
		body: "Finder scouts products with verified Stripe and Lemon Squeezy MRR, reads the negatives, and generates sequenced prompts for Cursor, Grok, and Claude.",
		badge: `${count} earning startups`,
		live: "Live from TrustMRR",
		steps: [
			{
				n: "01",
				t: "Scout revenue",
				d: "Products with verified paying subscribers."
			},
			{
				n: "02",
				t: "Mine the 1-stars",
				d: "Public complaints and pricing gaps, clustered."
			},
			{
				n: "03",
				t: "Vibe-code the rival",
				d: "A 27-section master PRD plus implementation prompts."
			}
		]
	};
}
function ProductGrid({ products }) {
	if (products.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-zinc-300",
			children: "No items match this filter"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-zinc-500",
			children: "Try another tab, or search a keyword above."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
	});
}
function HitGrid({ hits, empty }) {
	if (hits.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-zinc-300",
			children: "Desk channel is quiet right now"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-zinc-500",
			children: empty
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitCard, { hit: h }, `${h.kind}:${h.id}`))
	});
}
//#endregion
export { Home as component };
