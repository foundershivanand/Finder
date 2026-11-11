# IMPLEMENTATION_ROADMAP.md — Engineering Roadmap to Production

This roadmap outlines the sequenced phases required for ongoing evolution, scaling, and operational excellence of the Finder platform.

---

## Phase 1: Critical Fixes, Security & Resilience (COMPLETED)
- [x] **Fix Critical Security Issues**: Remove hardcoded Gemini, OpenRouter, and Turso tokens from codebase.
- [x] **Fix Test Regressions**: Resolve test failures in `browser-smoke-verdict.test.mjs` and `grok-pwa-plugin.test.mjs`.
- [x] **Eliminate ESLint Errors**: Fix ESLint configuration to ignore `.wrangler/**` and resolve syntax warnings across components.
- [x] **Implement TrustMRR Offline Resilience**: Add `FALLBACK_STARTUPS` and `getFallbackProfile` to prevent home page crashes during upstream API timeouts.
- [x] **Linux EMFILE Mitigation**: Configure `vite.config.ts` ignore list and polling fallback to eliminate `EMFILE: too many open files`.
- [x] **Chat Advisor Rate Limiting**: Implement sliding-window rate limiter on `chatWithAdvisor` endpoint.
- [x] **React Key Uniqueness**: Fix duplicate React keys in `BriefView` list iterations.
- [x] **Automated E2E Journey Suite**: Add Playwright headless user journey test (`scripts/e2e-journey.mjs`).
- [x] **Validate Production Build & Dev SSR**: Pass `typecheck`, `test` (267 unit tests), `test:e2e`, `lint`, and dual-viewport browser smoke testing.

---

## Phase 2: Production Secret Configuration & Deployment (IMMEDIATE)
- [ ] **Step 2.1: Cloudflare Pages / Vercel Environment Configuration**:
  - Configure `GEMINI_API_KEY` in deployment settings.
  - Configure `OPENROUTER_API_KEY` (optional secondary failover).
  - Configure `TURSO_AUTH_TOKEN` (optional direct database push).
- [ ] **Step 2.2: Production Domain & DNS Verification**:
  - Verify Cloudflare custom domain / DNS routing (`finder-d17.pages.dev` or custom domain).
  - Verify HTTPS certificate and PWA service worker scope.

---

## Phase 3: Performance, Caching & Scalability (NEXT CYCLE)
- [ ] **Step 3.1: Cloudflare KV Edge Cache**:
  - Migrate in-memory Map caches to Cloudflare Workers KV bindings for multi-region edge persistence.
  - Implement 30-minute stale-while-revalidate caching headers.
- [ ] **Step 3.2: Analytics & Telemetry**:
  - Integrate privacy-preserving event tracking (e.g. Plausible or Cloudflare Web Analytics) for desk interaction metrics.

---

## Phase 4: Extended Features & Ecosystem Integrations (FUTURE)
- [ ] **Step 4.1: Direct Webhook Subscriptions**:
  - Listen to Product Hunt daily webhook and Reddit push APIs for sub-second opportunity notifications.
- [ ] **Step 4.2: Bi-directional Project Manage Sync**:
  - Pull execution progress (completed tasks, shipped MVP status) back from Project Manage to display "In-Progress By Community" badges on Finder ideas.
