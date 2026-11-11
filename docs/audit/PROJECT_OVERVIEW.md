# PROJECT_OVERVIEW.md — Finder Architecture & Tech Stack

## 1. Executive Concept

**Finder** (also known as the *Riposte Startup Intelligence Engine*) is a specialized intelligence desk and builder workspace designed for solo founders, indie hackers, and "vibe coders".

Instead of generating generic startup ideas from scratch, Finder mines real, verified demand signals and revenue data across 13 primary and secondary opportunity desks:
- **TrustMRR**: Verified revenue, MRR, growth percentages, and acquisitions.
- **Reddit**: Real user complaints and unmet requests from `r/SomebodyMakeThis`, `r/AppIdeas`, and `r/SaaS`.
- **Apple App Store**: Top-grossing iOS apps filtered for 1-star to 3-star reviews that expose flaws in incumbents.
- **Google Play Store**: Android hits with user UX complaints and missing features.
- **Twitter / X**: Founder pain points, "I wish there was an app that...", and willingness-to-pay signals.
- **Product Hunt**: Daily launches with critique comment threads.
- **Hacker News**: Show HN and Ask HN launches with technical critiques and developer pain points.
- **GitHub**: Trending open-source repositories whose issue trackers serve as product opportunity specifications.
- **BetaList**: Startups in private beta where an indie hacker can ship a faster alternative.
- **Lobsters, DEV Community, Firefox Add-ons, Launching Next**: Developer tools, extensions, and niche utilities.

For every opportunity, Finder synthesizes a **Master Blueprint** comprising:
1. Contrarian Product Thesis & Wedge
2. Concrete Competitor Flanks (derived from real reviews/complaints)
3. Step-by-Step Vibe-Coding Plan (with exact LLM prompts and done-when conditions)
4. Recommended Modern Tech Stack
5. MVP Scope vs. Out-of-Scope boundaries
6. Go-To-Market / Launch Strategy (first 100 users, pricing model, differentiator)
7. One-click export to **Project Manage** (syncing 817+ launch tasks to Turso/libSQL).

---

## 2. System Architecture

```
[ Client Browser / PWA ]
          │
          │ HTTP / JSON / SSE / Hydration
          ▼
[ TanStack Start SSR Server & Nitro Runtime (Vite 8 / Node 22) ]
    │                      │                      │
    ├── Server Functions   ├── Auth Layer         ├── External Desks
    │   ├── fetchScout     │   (Better Auth +     │   ├── TrustMRR API
    │   ├── fetchDesk      │    PGLite/Postgres)  │   ├── Reddit / Arctic Shift RSS
    │   ├── fetchDossier   │                      │   ├── App Store RSS / Lookup
    │   ├── generateBrief  │                      │   ├── Google Play Store
    │   ├── chatWithAdvisor│                      │   ├── Hacker News / Algolia
    │   └── pushToProject..│                      │   └── GitHub / Mozilla Addons
    │                      │                      │
    ├── AI Advisor Engine  └── Turso Sync Gateway └── Local Resilience Cache
    │   ├── Google Gemini      (libSQL Pipeline       (Memory TTL + Fallback
    │   ├── OpenRouter LLMs     HTTP API)              Validated Datasets)
    │   └── Local Fallback
```

---

## 3. Technology Stack Breakdown

| Layer | Technologies & Libraries | Purpose & Configuration |
|---|---|---|
| **Framework & SSR** | TanStack Start (`~1.168.60`), TanStack Router (`^1.170.0`), Nitro (`3.0.260610-beta`) | Type-safe SSR, file-based routing, client-side caching & server function RPCs |
| **Frontend UI** | React 19 (`^19.2.0`), Tailwind CSS v4 (`^4.3.0`), Radix UI Primitives | Accessible dark-mode modern dashboard UI, glassmorphic cards, responsive mobile/desktop |
| **Icons & Design** | Lucide React (`^0.510.0`), Class Variance Authority, Tailwind Merge | Cohesive, minimal indie-hacker aesthetic |
| **State Management** | Zustand (`^5.0.0`), TanStack Query (`^5.101.0`), LocalStorage | Client-side transient states, ecosystem modal, saved briefs persistence |
| **Validation & Schema** | Zod v4 (`^4.4.0`) | Rigorous runtime type validation on server functions, briefs, and AI output |
| **AI Integration** | Google Gemini (`v1beta`), OpenRouter API (`v1`), xAI Grok fallback | Multi-tier AI reasoning for market intelligence, strategy advice, and vibe plans |
| **Database & Cache** | Neon Postgres / `@electric-sql/pglite` (`^0.5.4`), In-memory TTL caches | Zero-config embedded WASM Postgres for preview/dev + pluggable Neon Postgres |
| **External Integration**| Turso libSQL Pipeline, TrustMRR REST, Reddit Arctic-Shift, Apple iTunes RSS | Cross-platform data ingestion and ecosystem sync |
| **Quality & Testing** | Node test runner (`node --test`), Playwright (`^1.62.0`), TypeScript (`^5.7.0`), ESLint 9 | Static typecheck, headless browser verification, unit & integration tests |
