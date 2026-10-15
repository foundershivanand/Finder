import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ArrowLeft, _ as Compass, h as Download, o as Sparkles, r as Trash2, y as Bookmark } from "../_libs/lucide-react.mjs";
import { n as Button, o as listSavedBriefs, s as removeBrief, t as AppHeader } from "./app-header-YYYCmjB6.mjs";
import { a as formatUsd, d as parseHitKey } from "./format-xEnlTVnE.mjs";
import { t as PlatformIcon } from "./platform-icons-DFJjkngO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-Q-W8KXKN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setItems(listSavedBriefs());
	}, []);
	function exportAll() {
		const json = JSON.stringify(items, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `finder-saved-blueprints-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mt-6 inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back to Scout"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-border/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase font-mono tracking-wider text-faint font-semibold",
								children: "Saved Blueprints"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
							children: "Your Idea Vault"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [items.length === 1 ? "1 saved vibe-code plan" : `${items.length} saved vibe-code plans`, " stored on this device."]
						})
					] }), items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: exportAll,
						className: "text-xs h-9 border-border bg-card hover:bg-card-2 text-foreground shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1.5 text-muted" }), "Export All (.json)"]
					}) : null]
				}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 rounded-2xl bg-card border border-border/80 p-12 text-center shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto size-12 rounded-2xl bg-card-2 border border-border/70 flex items-center justify-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-6 text-faint" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base font-semibold text-foreground",
							children: "No saved blueprints yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-muted max-w-sm mx-auto leading-relaxed",
							children: "Explore ideas from Reddit, Product Hunt, App Store, Play Store, or TrustMRR, then tap Save on any generated vibe plan."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 h-9",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5 mr-1.5" }), "Go Scout Ideas"]
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 flex flex-col gap-3",
					children: items.map((item) => {
						const parsed = parseHitKey(item.brief.slug);
						const kind = item.profile.kind ?? parsed?.kind ?? "trustmrr";
						const id = item.profile.id ?? parsed?.id ?? item.brief.slug;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-2xl bg-card border border-border/80 p-5 transition-all hover:border-emerald-500/30 hover:bg-card-2 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformIcon, {
													kind,
													className: "size-3.5 shrink-0"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-mono uppercase tracking-wider text-muted font-medium",
													children: kind
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-faint",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-mono text-emerald-400",
													children: [item.brief.vibeGuide?.length ?? 5, " steps"]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-1 font-semibold text-base text-foreground truncate",
											children: item.brief.productName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs text-muted truncate",
											children: [
												"Ship ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: item.brief.opportunity.betterName
												}),
												" — ",
												item.brief.opportunity.positioning
											]
										}),
										kind === "trustmrr" && item.profile.revenue?.last30Days ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 font-mono text-[11px] text-emerald-300",
											children: [formatUsd(item.profile.revenue.last30Days), " / 30d"]
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										className: "h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/hit/$kind/$id",
											params: {
												kind,
												id
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 ml-1.5" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										className: "h-9 px-2.5 text-xs text-muted hover:text-rose-400 hover:bg-rose-950/20",
										onClick: () => setItems(removeBrief(item.brief.slug)),
										"aria-label": "Remove",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								})]
							})
						}, item.brief.slug);
					})
				})
			]
		})]
	});
}
//#endregion
export { SavedPage as component };
