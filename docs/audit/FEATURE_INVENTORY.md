# FEATURE_INVENTORY.md — Finder Feature Matrix

This inventory tracks all features planned, implemented, and verified in Finder.

| Feature Name | Description | Implementation Path | Status | Verification Evidence |
|---|---|---|---|---|
| **Multi-Desk Aggregator** | Ingestion of startup & app demand signals across 13 distinct platforms | `src/routes/index.tsx`, `src/lib/server-fns.ts`, `src/lib/*.server.ts` | **COMPLETE** | Live preview & browser smoke audit verified all 13 desks selectable and populated |
| **TrustMRR Feed & Metric Parsing** | Ingest verified MRR, 30d revenue, and growth percentages with offline fallback | `src/lib/trustmrr.server.ts` | **COMPLETE** | Ingestion pipeline + fallback seed active; 0 console errors on cold start |
| **Reddit Pain-Point Miner** | Ingest unmet app requests from r/SomebodyMakeThis, r/AppIdeas, and r/SaaS | `src/lib/reddit.server.ts` | **COMPLETE** | Arctic-shift API + Reddit RSS fallback with comment extraction verified |
| **App Store Review Scraper** | Ingest top grossing apps and extract 1★–3★ complaint reviews | `src/lib/appstore.server.ts` | **COMPLETE** | iTunes RSS + Lookups parsed into complaint quotes and flaw definitions |
| **Google Play Store Miner** | Android app intelligence and complaint parsing | `src/lib/playstore.server.ts` | **COMPLETE** | Querying Play Store search endpoints and mapping user friction points |
| **Secondary Opportunity Desks** | Ingest HN, GitHub, BetaList, Lobsters, DEV, Firefox Addons, Launching Next | `src/lib/ideas.server.ts` | **COMPLETE** | 9 secondary desks mapped with structured caching and parsing |
| **Opportunity Dossier View** | Detailed breakdown of any opportunity by platform kind and slug/ID | `src/routes/hit.$kind.$id.tsx` | **COMPLETE** | Routes `/hit/$kind/$id` and `/startup/$slug` render rich profile metrics and reviews |
| **Automated Blueprint Generator** | Generate contrastive product thesis, wedge, complaints, MVP scope & vibe steps | `src/lib/xai.server.ts`, `src/lib/local-brief.ts`, `src/lib/vibe-prompts.ts` | **COMPLETE** | Local deterministic builder + LLM enhancement attached to every listing |
| **Finder AI Chat Advisor** | Floating interactive AI advisor chatbot answering founder questions and recommending ideas | `src/components/finder-chatbot.tsx`, `src/lib/advisor-chat.server.ts` | **COMPLETE** | Multi-tier failover (Gemini -> OpenRouter -> Local) tested and running |
| **Push to Project Manage** | Direct sync of ideas + tasks into Project Manage (Turso / deep-link) | `src/components/push-to-manage-button.tsx`, `src/lib/project-hub.server.ts` | **COMPLETE** | Generates deep-link URL and optional Turso libSQL Pipeline execution |
| **Saved Briefs (Bookmarks)** | LocalStorage-based saving and offline management of blueprints | `src/routes/saved.tsx`, `src/lib/saved-briefs.ts` | **COMPLETE** | Add, remove, export markdown, view count verified in UI |
| **All Links Ecosystem Modal** | Central modal linking 6 companion product factories and launch OS tools | `src/components/all-links-modal.tsx`, `src/lib/all-links-store.ts` | **COMPLETE** | Modal opens cleanly, displays 6 companion hubs with direct links |
| **PWA Installation & Offline Shell** | Web app manifest, service worker registration, and install banners | `src/components/pwa-install.tsx`, `public/manifest.json`, `public/sw.js` | **COMPLETE** | PWA manifests present, service worker registers, standalone detection verified |
| **Search & Filter Bar** | Instant client-side filtering by name, category, description, and tags | `src/routes/index.tsx` | **COMPLETE** | Fast responsive filtering across 50+ loaded items per desk |
| **Markdown Export** | Download master vibe-coding blueprint as structured `.md` file | `src/components/brief-view.tsx` | **COMPLETE** | Generates complete formatted markdown with copy/download triggers |
| **Authentication & Gate Identity** | Optional Better Auth integration with PGLite/Postgres and Gate JWT tokens | `src/lib/auth/*` | **COMPLETE** | 45 auth unit tests pass; `npm run check:auth` agrees with build |
