import { r as __toESM } from "../_runtime.mjs";
import { a as formatUsd, d as parseHitKey } from "./format-xEnlTVnE.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Compass, E as Boxes, M as ArrowLeft, O as Bookmark, b as Download, o as Sparkles, r as Trash2, v as FolderKanban, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as Button, o as listSavedBriefs, s as removeBrief, t as AppHeader } from "./app-header---E76V9W.mjs";
import { i as pushIdeaToProjectManage, n as PlatformIcon, r as mapOpportunityTag, t as AppFooter } from "./platform-icons-238j9NXI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-DmATQPyQ.js
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
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mt-6 inline-flex h-8 items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Scout" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-white/[0.06]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium",
									children: "Vault"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white",
								children: "Saved Blueprints"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-zinc-400",
								children: [items.length === 1 ? "1 saved vibe plan" : `${items.length} saved vibe plans`, " stored on this device."]
							})
						] }), items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: exportAll,
							className: "text-xs h-8 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 mr-1.5 text-zinc-400" }), "Export JSON"]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-zinc-300 text-xs leading-relaxed",
								children: [
									"Ready to execute? Track tasks in",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-white font-medium",
										children: "Product Hub"
									}),
									" (817-task launch OS) or pull 33 production modules from",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-white font-medium",
										children: "Code Library"
									}),
									"."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								className: "h-7 text-[11px] border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.06]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://project-manage-z6u.pages.dev/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product Hub" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-2.5 opacity-60" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								className: "h-7 text-[11px] border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.06]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://reusable-library.foundershivanand.workers.dev/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "size-3 text-emerald-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Code Library" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-2.5 opacity-60" })
									]
								})
							})]
						})]
					}),
					items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-xl bg-white/[0.02] border border-white/[0.06] p-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto size-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium text-zinc-300",
								children: "No saved blueprints yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-zinc-500",
								children: "Explore ideas from Reddit, Product Hunt, App Store, Play Store, or TrustMRR, then tap Save on any generated plan."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "mt-5 h-8.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go Scout Ideas" })]
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 flex flex-col gap-2.5",
						children: items.map((item) => {
							const parsed = parseHitKey(item.brief.slug);
							const kind = item.profile.kind ?? parsed?.kind ?? "trustmrr";
							const id = item.profile.id ?? parsed?.id ?? item.brief.slug;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-xl bg-card/60 hover:bg-card-2/80 border border-white/[0.06] hover:border-white/[0.14] p-4 transition-all shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
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
														className: "text-[10px] font-mono uppercase tracking-wider text-zinc-400",
														children: kind
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-zinc-600 text-[10px]",
														children: "•"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-mono text-zinc-400",
														children: [item.brief.vibeGuide?.length ?? 5, " steps"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-1 font-semibold text-sm text-zinc-100 truncate",
												children: item.brief.productName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-xs text-zinc-400 truncate",
												children: [
													"Ship ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-zinc-200 font-medium",
														children: item.brief.opportunity.betterName
													}),
													" — ",
													item.brief.opportunity.positioning
												]
											}),
											kind === "trustmrr" && item.profile.revenue?.last30Days ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1.5 font-mono text-[11px] text-zinc-300",
												children: [formatUsd(item.profile.revenue.last30Days), " / 30d"]
											}) : null
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												size: "sm",
												variant: "outline",
												onClick: () => {
													pushIdeaToProjectManage({
														name: item.brief.opportunity.betterName || item.brief.productName,
														description: item.brief.thesis || item.brief.opportunity.positioning || "",
														url: item.profile.website || `https://finder-d17.pages.dev/hit/${kind}/${id}`,
														tag: mapOpportunityTag(kind, item.profile.category),
														status: "idea",
														source: `Finder (${kind})`,
														sourceUrl: `https://finder-d17.pages.dev/hit/${kind}/${id}`,
														blueprint: item.brief.masterBlueprint ?? void 0,
														vibeGuide: item.brief.vibeGuide?.map((s) => ({
															step: s.step,
															title: s.title,
															why: s.why,
															prompt: s.prompt,
															doneWhen: s.doneWhen
														}))
													});
												},
												className: "h-8 px-2.5 text-xs border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.06]",
												title: "Push to Project Manage",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-3 mr-1 text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Push" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "sm",
												className: "h-8 px-3 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/hit/$kind/$id",
													params: {
														kind,
														id
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 ml-1" })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "sm",
												variant: "ghost",
												className: "h-8 px-2 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20",
												onClick: () => setItems(removeBrief(item.brief.slug)),
												"aria-label": "Remove",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
											})
										]
									})]
								})
							}, item.brief.slug);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFooter, {})
		]
	});
}
//#endregion
export { SavedPage as component };
