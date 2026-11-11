import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as BookmarkCheck, C as Copy, E as Check, N as ArrowLeft, b as Download, d as RefreshCw, g as Layers, h as LoaderCircle, i as Terminal, k as Bookmark, o as Sparkles, v as FolderKanban, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, c as removeBrief, l as saveBrief, n as AppHeader, o as getSavedBrief, r as Button, t as AllLinksButton, u as useAllLinksModal } from "./app-header-D3EzbYIq.mjs";
import { a as formatUsd, i as formatRating, n as formatCount, r as formatGrowth, s as initials } from "./format-xEnlTVnE.mjs";
import { n as Route, s as generateBrief } from "./router-Sek10w9D.mjs";
import { i as pushIdeaToProjectManage, n as PlatformIcon, r as mapOpportunityTag, t as AppFooter } from "./platform-icons-7XInBv_F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hit._kind._id-qVpDgTmT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-card-2 text-muted",
		money: "bg-money/15 text-money",
		pain: "bg-pain/15 text-pain",
		outline: "border border-border text-muted",
		primary: "bg-primary/15 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function BriefView({ brief, reviews = [], showPlan = true, kind = "trustmrr" }) {
	const isAskDesk = kind === "reddit" || kind === "twitter" || kind === "hackernews";
	const [pushed, setPushed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl shadow-black/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "The Market Opportunity" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug",
						children: brief.thesis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-2 pt-6 border-t border-border/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Recommended Name",
								value: brief.opportunity.betterName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Target Customer",
								value: brief.opportunity.whoItsFor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Positioning Wedge",
								value: brief.opportunity.positioning
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Why Build Now",
								value: brief.opportunity.whyNow
							})
						]
					})
				]
			}),
			reviews.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: isAskDesk ? "The Public Asks" : "Negative Review Traces" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-xl sm:text-2xl font-bold text-foreground",
					children: isAskDesk ? "What real buyers typed" : "What users complained about"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-mono text-faint",
					children: [reviews.length, " mined signals"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 flex flex-col gap-2.5",
				children: reviews.slice(0, 6).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-card/80 border border-border/70 p-4 transition-colors hover:border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] uppercase font-mono tracking-wider text-faint",
						children: [
							r.source,
							" ",
							r.title ? `• ${r.title}` : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans",
						children: [
							"\"",
							r.body,
							"\""
						]
					})]
				}, r.url + r.body.slice(0, 24)))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: isAskDesk ? "The Unmet Requests" : "The 1-Star Review Flanks" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-xl sm:text-2xl font-bold text-foreground",
					children: isAskDesk ? "Where you win the market" : "Weaknesses you can kill"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs sm:text-sm text-muted",
					children: isAskDesk ? "Mined directly from user comments and feature requests. Beat these and you own the cohort." : "Direct quotes from store reviews and user grievances. Build the antidote that fixes them on day 1."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 flex flex-col gap-3",
					children: brief.complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintCard, { complaint: c }, c.theme))
				})
			] }),
			brief.gaps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Market White Space" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-xl sm:text-2xl font-bold text-foreground",
					children: "Gaps left wide open"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2.5 sm:grid-cols-2",
					children: brief.gaps.map((gap) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-card border border-border/70 p-3.5 text-xs sm:text-sm leading-relaxed text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-400 font-bold shrink-0",
								children: "✓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: gap })]
						})
					}, gap))
				})
			] }) : null,
			showPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanSections, { brief }) : null
		]
	});
}
function PlanSections({ brief }) {
	const [pushed, setPushed] = (0, import_react.useState)(false);
	function downloadMarkdown() {
		const content = serializeFullMarkdown(brief);
		const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${brief.opportunity.betterName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-vibe-plan.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "vibe-plan",
		className: "flex flex-col gap-12",
		children: [
			brief.masterBlueprint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card border border-emerald-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Agent Constitution" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-xl sm:text-2xl font-bold text-foreground",
								children: "Master 27-Section Blueprint"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Complete architecture, schema, security rules, and prompt instructions for Cursor, Windsurf, or Claude Code."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: downloadMarkdown,
								className: "text-xs h-9 border-border bg-card-2 hover:bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1 text-muted" }), "Export .md"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
								text: brief.masterBlueprint,
								label: "Copy Master Prompt",
								className: "h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBlock, {
							title: "Full Constitution & Architecture Specification",
							text: brief.masterBlueprint,
							defaultOpen: false
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Step-By-Step Vibe Code Sequence" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-xl sm:text-2xl font-bold text-foreground",
						children: "Implementation Prompts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs sm:text-sm text-muted",
						children: "Paste each prompt sequentially into your coding agent. Verify the \"Done when\" checklist before proceeding."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0",
					children: [brief.vibeGuide.length, " sequenced prompts"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-4",
				children: brief.vibeGuide.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, { step }, step.step))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card border border-border/80 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Recommended Stack" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold text-foreground",
								children: brief.stack.recommendation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs leading-relaxed text-muted",
								children: brief.stack.reason
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: brief.stack.pieces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] py-0 px-2 font-mono",
									children: p
								}, p))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card border border-border/80 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "MVP Scope (Ship Fast)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2 text-xs leading-relaxed text-foreground",
							children: brief.mvpScope.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-400 font-bold shrink-0",
									children: "•"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, item))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card border border-border/80 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-faint",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Out of Scope (Post-MVP)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2 text-xs leading-relaxed text-muted",
							children: brief.outOfScope.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-faint font-bold shrink-0",
									children: "•"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, item))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.03] p-5 sm:p-6 transition-all",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Product Factories & Pre-Built Modules" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-base sm:text-lg font-semibold tracking-tight text-foreground",
								children: "Accelerate with 5 Product Factories & Modules"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted leading-relaxed",
								children: "Explore 196+ battle-tested modules across Product Hub, Bots Factory, AI Agent Factory, Mobile Factory, and Web Code Library."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllLinksButton, { label: "All Links (5 Hubs)" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card border border-border/80 p-6 sm:p-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Go-To-Market & First Users" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-5 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "First 100 Users Channel",
							value: brief.launch.firstUsers
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Monetization & Pricing",
							value: brief.launch.pricing
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "The Moat / Differentiator",
							value: brief.launch.differentiator
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-card to-background p-6 sm:p-8 shadow-2xl relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-emerald-500/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Ready to Build This Idea?" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mt-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground",
							children: [
								"Push ",
								brief.opportunity.betterName,
								" to Project Manage"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs sm:text-sm text-muted max-w-xl",
							children: "Track this project through Idea, Working, Done, and Deployed stages with the 817-task Master Launch Checklist and your sequenced vibe prompts."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: () => {
							setPushed(true);
							setTimeout(() => setPushed(false), 3e3);
							pushIdeaToProjectManage({
								name: brief.opportunity.betterName || brief.productName,
								description: brief.thesis || brief.opportunity.positioning || "",
								url: typeof window !== "undefined" ? window.location.href : void 0,
								tag: "saas",
								status: "idea",
								source: "Finder Vibe Blueprint",
								sourceUrl: typeof window !== "undefined" ? window.location.href : void 0,
								blueprint: brief.masterBlueprint ?? void 0,
								vibeGuide: brief.vibeGuide?.map((s) => ({
									step: s.step,
									title: s.title,
									why: s.why,
									prompt: s.prompt,
									doneWhen: s.doneWhen
								}))
							});
						},
						className: "h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 shrink-0 inline-flex items-center gap-2 transition-all hover:scale-[1.02]",
						children: [
							pushed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-emerald-200" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pushed ? "Pushed to Project Manage!" : "Push to Project Manage" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5 opacity-80" })
						]
					})]
				})]
			})
		]
	});
}
function Kicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase font-mono tracking-wider text-faint font-semibold",
		children
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase font-mono tracking-wider text-faint",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-xs sm:text-sm font-medium leading-relaxed text-foreground",
		children: value
	})] });
}
function ComplaintCard({ complaint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl bg-card border border-border/80 p-5 transition-all hover:border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: complaint.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: complaint.theme
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-mono text-faint",
					children: complaint.sourced ? complaint.source : "Inferred Flank"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "mt-3 border-l-2 border-rose-500/60 pl-3.5 text-sm sm:text-base leading-snug text-foreground/90 italic",
				children: [
					"\"",
					complaint.quote,
					"\""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-xl bg-card-2 p-3 border border-border/50 flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-emerald-400 font-bold text-xs shrink-0 mt-0.5",
					children: "Antidote:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground",
					children: complaint.howToFix
				})]
			})
		]
	});
}
function SeverityBadge({ severity }) {
	if (severity === "critical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30",
		children: "CRITICAL"
	});
	if (severity === "high") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30",
		children: "HIGH"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30",
		children: "MEDIUM"
	});
}
function StepCard({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-card border border-border/80 p-5 sm:p-6 transition-all hover:border-emerald-500/30 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "size-8 rounded-xl bg-card-2 border border-border flex items-center justify-center shrink-0 font-mono text-xs font-bold text-emerald-400",
					children: ["0", step.step]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm sm:text-base font-semibold text-foreground",
						children: step.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted leading-relaxed",
						children: step.why
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptBlock, {
					title: `Prompt ${step.step} — Click to copy into coding agent`,
					text: step.prompt,
					defaultOpen: false
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3.5 flex items-center gap-2 text-xs text-muted border-t border-border/60 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-400 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-medium",
						children: "Done when:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground truncate",
						children: step.doneWhen
					})
				]
			})
		]
	});
}
function PromptBlock({ title, text, defaultOpen = false }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	const words = text.trim().split(/\s+/).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl bg-card-2 border border-border/80",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 border-b border-border/70 px-3.5 py-2.5 bg-card/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-3.5 text-faint shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[11px] font-mono uppercase tracking-wider text-muted font-medium",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-mono text-faint shrink-0",
						children: [
							"(",
							words,
							" words)"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[11px] text-muted hover:text-foreground font-mono px-2 py-1 rounded hover:bg-card transition-colors",
					onClick: () => setOpen((v) => !v),
					children: open ? "Collapse" : "Expand"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text,
					className: "h-7 text-xs bg-card hover:bg-card-2"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: cn("overflow-auto p-3.5 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap select-all", open ? "max-h-[500px]" : "max-h-36"),
			children: text
		})]
	});
}
function CopyButton({ text, label = "Copy Prompt", className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		size: "sm",
		variant: "outline",
		className: cn("h-8 px-2.5 text-xs font-medium inline-flex items-center gap-1.5 transition-all", className),
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 1600);
			} catch {}
		},
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied!" : label })]
	});
}
function serializeFullMarkdown(brief) {
	return [
		`# Finder Vibe Coding Blueprint: ${brief.opportunity.betterName}`,
		`Generated for: ${brief.productName}`,
		`Thesis: ${brief.thesis}`,
		"",
		"## 1. Positioning",
		`- **Product Name**: ${brief.opportunity.betterName}`,
		`- **Target Audience**: ${brief.opportunity.whoItsFor}`,
		`- **Positioning Angle**: ${brief.opportunity.positioning}`,
		`- **Why Now**: ${brief.opportunity.whyNow}`,
		"",
		"## 2. Incumbent Flanks & Complaints Solved",
		...brief.complaints.map((c) => `- [${c.severity.toUpperCase()}] **${c.theme}**: "${c.quote}" -> Antidote: ${c.howToFix}`),
		"",
		"## 3. Tech Stack",
		`- **Recommendation**: ${brief.stack.recommendation}`,
		`- **Reason**: ${brief.stack.reason}`,
		`- **Libraries**: ${brief.stack.pieces.join(", ")}`,
		"",
		"## 4. Master Blueprint",
		brief.masterBlueprint ?? "None",
		"",
		"## 5. Implementation Sequence",
		...brief.vibeGuide.flatMap((s) => [
			`### Step ${s.step}: ${s.title}`,
			`*Why*: ${s.why}`,
			"",
			"```text",
			s.prompt,
			"```",
			`*Done When*: ${s.doneWhen}`,
			""
		])
	].join("\n");
}
var STAGE_LINES = [
	"Reading the product listing and negatives",
	"Clustering 1-star reviews and user requests",
	"Writing copy-paste vibe-coding prompts"
];
function HitPage() {
	const dossier = Route.useLoaderData();
	const profile = dossier.profile;
	const [brief, setBrief] = (0, import_react.useState)(dossier.brief);
	const [planReady, setPlanReady] = (0, import_react.useState)(false);
	const [justGenerated, setJustGenerated] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [iconBroken, setIconBroken] = (0, import_react.useState)(false);
	const [warning, setWarning] = (0, import_react.useState)(null);
	const [pushed, setPushed] = (0, import_react.useState)(false);
	const { open: openAllLinks } = useAllLinksModal();
	(0, import_react.useEffect)(() => {
		const existing = getSavedBrief(dossier.brief.slug);
		if (existing) {
			setBrief(existing.brief);
			setSaved(true);
			setPlanReady(true);
		} else {
			setBrief(dossier.brief);
			setSaved(false);
			setPlanReady(false);
		}
		setJustGenerated(false);
		setIconBroken(false);
		setWarning(null);
	}, [
		dossier.brief,
		profile.id,
		profile.kind
	]);
	(0, import_react.useEffect)(() => {
		if (!busy) return;
		setStage(0);
		const id = window.setInterval(() => {
			setStage((s) => (s + 1) % STAGE_LINES.length);
		}, 1400);
		return () => window.clearInterval(id);
	}, [busy]);
	async function run() {
		if (busy) return;
		setBusy(true);
		setJustGenerated(false);
		setWarning(null);
		const started = Date.now();
		const local = dossier.brief;
		let next = local;
		try {
			const result = await generateBrief({ data: {
				kind: profile.kind,
				id: profile.id
			} });
			if (result.ok && result.brief) {
				next = result.brief;
				if (result.warning) setWarning(result.warning);
			} else if (!result.ok) {
				next = local;
				setWarning(result.error || "Could not reach Grok — showing traces plan.");
			}
		} catch {
			next = local;
			setWarning("Could not reach Grok — showing traces plan.");
		}
		const elapsed = Date.now() - started;
		if (elapsed < 700) await new Promise((r) => window.setTimeout(r, 700 - elapsed));
		setBrief(next);
		setPlanReady(true);
		setJustGenerated(true);
		setBusy(false);
		window.requestAnimationFrame(() => {
			document.getElementById("vibe-plan")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		});
	}
	function toggleSave() {
		if (!brief || !planReady) return;
		if (saved) {
			removeBrief(brief.slug);
			setSaved(false);
			return;
		}
		saveBrief({
			savedAt: (/* @__PURE__ */ new Date()).toISOString(),
			brief,
			profile: {
				kind: profile.kind,
				id: profile.id,
				slug: brief.slug,
				name: profile.name,
				icon: profile.icon,
				category: profile.category,
				revenue: profile.revenue,
				website: profile.website
			}
		});
		setSaved(true);
	}
	function downloadMarkdown() {
		const lines = [
			`# Finder Vibe Coding Blueprint: ${brief.opportunity.betterName}`,
			`Generated for: ${brief.productName}`,
			`Thesis: ${brief.thesis}`,
			"",
			"## 1. Positioning",
			`- **Product Name**: ${brief.opportunity.betterName}`,
			`- **Target Audience**: ${brief.opportunity.whoItsFor}`,
			`- **Positioning Angle**: ${brief.opportunity.positioning}`,
			`- **Why Now**: ${brief.opportunity.whyNow}`,
			"",
			"## 2. Master Blueprint",
			brief.masterBlueprint ?? "None",
			"",
			"## 3. Implementation Sequence",
			...brief.vibeGuide.flatMap((s) => [
				`### Step ${s.step}: ${s.title}`,
				`*Why*: ${s.why}`,
				"",
				s.prompt,
				"",
				`*Done When*: ${s.doneWhen}`,
				""
			])
		];
		const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${brief.opportunity.betterName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-plan.md`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	function handlePushToProjectManage() {
		setPushed(true);
		setTimeout(() => setPushed(false), 2500);
		pushIdeaToProjectManage({
			name: brief.opportunity.betterName || profile.name,
			description: brief.thesis || brief.opportunity.positioning || profile.description || "",
			url: profile.website || profile.sourceUrl || window.location.href,
			tag: mapOpportunityTag(profile.kind, profile.category),
			status: "idea",
			source: `Finder (${profile.kind})`,
			sourceUrl: window.location.href,
			blueprint: brief.masterBlueprint ?? void 0,
			vibeGuide: brief.vibeGuide?.map((s) => ({
				step: s.step,
				title: s.title,
				why: s.why,
				prompt: s.prompt,
				doneWhen: s.doneWhen
			}))
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background pb-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mt-6 inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back to Scout"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileHero, {
						profile,
						iconBroken,
						onIconError: () => setIconBroken(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-border/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold",
									children: planReady ? "Vibe Coding Plan Ready" : "Market Flank Analysis"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
									children: profile.kind === "reddit" ? `Ship ${brief.opportunity.betterName}` : `Beat ${brief.productName} with ${brief.opportunity.betterName}`
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden flex-wrap items-center gap-2 sm:flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											size: "sm",
											onClick: handlePushToProjectManage,
											className: "h-9 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02]",
											title: "Push this idea into Project Manage to track tasks and build",
											children: [pushed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1.5 text-emerald-200" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-3.5 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pushed ? "Pushed to Project Manage!" : "Push to Project Manage" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllLinksButton, {}),
										planReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: downloadMarkdown,
											className: "h-9 px-3 text-xs border-border bg-card hover:bg-card-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1.5 text-muted" }), "Export .md"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: toggleSave,
											className: "h-9 px-3 text-xs border-border bg-card hover:bg-card-2",
											children: [saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-3.5 mr-1.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-3.5 mr-1.5 text-muted" }), saved ? "Saved" : "Save"]
										})] }) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateButton, {
											busy,
											planReady,
											onClick: () => void run()
										})
									]
								})]
							}),
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 p-3 rounded-xl bg-card border border-emerald-500/30 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-mono text-emerald-300",
									children: [STAGE_LINES[stage], "..."]
								})]
							}) : null,
							justGenerated && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 px-4 py-3 text-xs text-emerald-300",
								children: [
									"✓ Plan ready — copy each prompt in order into Cursor or your coding agent. ",
									brief.vibeGuide.length,
									" sequenced steps for ",
									brief.opportunity.betterName,
									"."
								]
							}) : null,
							warning && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-amber-400/90",
								children: warning
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs sm:text-sm leading-relaxed text-muted",
								children: profile.kind === "reddit" ? "The thread comments are the acceptance tests. Generate writes a sequenced vibe-code plan you can paste into your coding agent." : "Negatives are mined from public store reviews and public traces. Generate writes the sequenced build plan."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefView, {
									brief,
									reviews: dossier.reviews,
									showPlan: false,
									kind: profile.kind
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12",
								children: planReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanSections, { brief }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneratePanel, {
									busy,
									onGenerate: () => void run(),
									name: brief.opportunity.betterName
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							onClick: handlePushToProjectManage,
							className: "h-10 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shrink-0",
							title: "Push to Project Manage",
							children: [pushed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 mr-1 text-emerald-200" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4 mr-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pushed ? "Pushed" : "Build" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: openAllLinks,
							className: "h-10 px-2.5 rounded-lg border border-border bg-card hover:bg-card-2 text-zinc-300 inline-flex items-center justify-center shrink-0 cursor-pointer",
							title: "All Ecosystem Links (5 Hubs)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-emerald-400" })
						}),
						planReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "h-10 px-3 border-border",
							onClick: toggleSave,
							children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateButton, {
							busy,
							planReady,
							onClick: () => void run(),
							className: "flex-1 h-10"
						})
					]
				})
			})
		]
	});
}
function ProfileHero({ profile, iconBroken, onIconError }) {
	const growth = formatGrowth(profile.growth30d ?? void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4 rounded-xl bg-card/60 border border-white/[0.07] p-4.5 sm:p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-white/[0.08] text-xs font-semibold text-zinc-400",
					children: profile.icon && !iconBroken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: profile.icon,
						alt: "",
						referrerPolicy: "no-referrer",
						className: "size-12 object-cover",
						onError: onIconError
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs",
						children: initials(profile.name)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformIcon, {
								kind: profile.kind,
								className: "size-3.5 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium",
								children: [profile.sourceLabel, profile.category ? ` • ${profile.category}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-lg sm:text-xl font-semibold tracking-tight text-white leading-snug",
							children: profile.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-zinc-400 line-clamp-3",
							children: profile.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 flex flex-wrap gap-1.5",
							children: [
								profile.onSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
									children: "For sale"
								}) : null,
								profile.stealthMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
									children: "Stealth"
								}) : null,
								profile.developer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
									children: profile.developer
								}) : null,
								profile.subreddit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]",
									children: ["r/", profile.subreddit]
								}) : null
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-3 gap-2.5 border-t border-white/[0.06] pt-4",
				children: profile.kind === "trustmrr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Last 30 days",
						value: formatUsd(profile.revenue.last30Days)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "MRR",
						value: formatUsd(profile.revenue.mrr)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "All-time",
						value: formatUsd(profile.revenue.total),
						extra: growth
					})
				] }) : profile.kind === "reddit" || profile.kind === "twitter" || profile.kind === "hackernews" || profile.kind === "lobsters" || profile.kind === "devto" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: profile.kind === "twitter" ? "From" : "Upvotes",
						value: profile.kind === "twitter" ? profile.developer ?? "X" : formatCount(profile.score)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Comments",
						value: formatCount(profile.comments)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Source",
						value: profile.sourceLabel
					})
				] }) : profile.kind === "github" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Stars",
						value: formatCount(profile.score)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Issues",
						value: formatCount(profile.comments)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Language",
						value: profile.category ?? "GitHub"
					})
				] }) : profile.kind === "firefox" || profile.kind === "appstore" || profile.kind === "playstore" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Store Rating",
						value: formatRating(profile.rating)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: profile.kind === "playstore" || profile.kind === "firefox" ? "Users" : "Ratings",
						value: profile.kind === "appstore" ? formatCount(profile.ratingsCount) : profile.installs ?? formatCount(profile.ratingsCount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: profile.rank ? "Chart Rank" : "Store",
						value: profile.rank ? `#${profile.rank}` : profile.sourceLabel
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Platform",
						value: profile.sourceLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Maker",
						value: profile.developer ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
						label: "Category",
						value: profile.category ?? "Launch"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3.5 flex flex-wrap gap-2 pt-3 border-t border-white/[0.05]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: profile.sourceUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["View on ", profile.sourceLabel] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-2.5 text-zinc-500" })]
				}), profile.website && profile.website !== profile.sourceUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: profile.website,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Website" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-2.5 text-zinc-500" })]
				}) : null]
			})
		]
	});
}
function GenerateButton({ busy, planReady, onClick, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		onClick,
		disabled: busy,
		className: cn("h-9 px-4 text-xs font-medium rounded-lg transition-all", planReady ? "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08]" : "bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm", className),
		children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }) : planReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5 mr-1.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? "Generating..." : planReady ? "Regenerate Blueprint" : "Generate Vibe Blueprint" })]
	});
}
function GeneratePanel({ busy, onGenerate, name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "vibe-plan",
		className: "rounded-xl bg-white/[0.015] border border-white/[0.08] p-6 sm:p-8 text-center relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-zinc-400 bg-white/[0.03] border border-white/[0.06]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vibe Engine" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white",
				children: [
					"Build ",
					name,
					" with your AI coding agent"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-zinc-400",
				children: "Generates a 27-section master PRD and sequenced prompts covering architecture, schema, features, and deployment."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					onClick: onGenerate,
					disabled: busy,
					className: "h-9.5 px-5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs shadow-sm transition-all",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? "Generating Blueprint..." : "Generate Vibe Blueprint" })]
				})
			})
		]
	});
}
function Money({ label, value, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[9px] uppercase font-mono tracking-wider text-zinc-500",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 font-mono text-sm sm:text-base font-medium tabular-nums text-zinc-200",
			children: value
		}),
		extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-mono tabular-nums text-emerald-400",
			children: extra
		}) : null
	] });
}
//#endregion
export { HitPage as component };
