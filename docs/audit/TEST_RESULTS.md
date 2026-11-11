# TEST_RESULTS.md — Execution & Verification Log

**Audit Timestamp**: 2026-11-12T02:40:00+05:30  
**Environment**: Linux (Node.js v22.23.2, Playwright Chromium, Vite 8.2.2)

---

## 1. Automated Test Execution Summary

| Test Suite File | Type | Total Tests | Passed | Failed | Duration | Status |
|---|---|---|---|---|---|---|
| `scripts/brand-check.test.mjs` | Unit (Scripts) | 29 | 29 | 0 | ~350ms | **PASS** |
| `scripts/browser-smoke-verdict.test.mjs` | Unit (Scripts) | 40 | 40 | 0 | ~120ms | **PASS** |
| `scripts/check-auth-invariant.test.mjs` | Unit (Scripts) | 18 | 18 | 0 | ~85ms | **PASS** |
| `scripts/grok-pwa-plugin.test.mjs` | Unit (Scripts) | 47 | 47 | 0 | ~160ms | **PASS** |
| `scripts/migration-plan.test.mjs` | Unit (Scripts) | 14 | 14 | 0 | ~60ms | **PASS** |
| `scripts/preview.test.mjs` | Unit (Scripts) | 12 | 12 | 0 | ~140ms | **PASS** |
| `scripts/sign-out-plan.test.mjs` | Unit (Scripts) | 8 | 8 | 0 | ~45ms | **PASS** |
| `scripts/with-app-env.test.mjs` | Unit (Scripts) | 15 | 15 | 0 | ~70ms | **PASS** |
| `scripts/write-atomic.test.mjs` | Unit (Scripts) | 12 | 12 | 0 | ~190ms | **PASS** |
| `src/lib/app-data/app-data.test.ts` | Unit (TS) | 19 | 19 | 0 | ~25ms | **PASS** |
| `src/lib/auth/gate-identity.test.ts` | Unit (TS) | 18 | 18 | 0 | ~240ms | **PASS** |
| `src/lib/auth/sign-in-gate.test.ts` | Unit (TS) | 8 | 8 | 0 | ~30ms | **PASS** |
| `src/lib/format.test.ts` | Unit (TS Domain) | 19 | 19 | 0 | ~15ms | **PASS** |
| `src/lib/advisor-chat.test.ts` | Unit (TS Service)| 8 | 8 | 0 | ~20ms | **PASS** |
| **TOTAL UNIT TESTS** | | **267** | **267** | **0** | **~1.7s** | **100% PASS** |

---

## 2. End-to-End User Journey Automation

| Test Suite | Framework | Journey Steps Verified | Result | Duration | Console Errors |
|---|---|---|---|---|---|
| `scripts/e2e-journey.mjs` | Playwright (Chromium) | 1. Homepage render<br>2. Desk switching (Reddit, App Store, TrustMRR)<br>3. Search & filter<br>4. Dossier & Blueprint view (`/hit/trustmrr/postiz`)<br>5. All Links modal popup<br>6. Bookmarks view (`/saved`)<br>7. Console error audit | **100% PASS** | ~6.5s | **0** |

---

## 3. Static Analysis & Build Gates

- **`npm run typecheck` (`tsc --noEmit`)**:
  - Result: **PASS** (Exit Code 0).
  - TypeScript version: 5.7.0.
  - Type errors: 0.

- **`npm run lint` (`eslint .`)**:
  - Result: **PASS** (Exit Code 0).
  - ESLint version: 9.20.0.
  - Errors: 0.
  - Warnings: 0.

- **`npm run build` (`vite build && db:migrate`)**:
  - Result: **PASS** (Exit Code 0).
  - Gzip bundle size of main app chunk: ~114 kB.
  - SSR server output: `.vercel/output/functions/__server.func`.

---

## 4. Dual-Viewport Browser Smoke Audit

### Development Server (`http://127.0.0.1:8080/`)
- Desktop (1280x800): HTTP 200, Body Len: 11,629 chars, 0 console errors, 0 page errors.
- Mobile (390x844): HTTP 200, Body Len: 10,952 chars, 0 horizontal overflow, 0 console errors.

### Built Production Output (`http://127.0.0.1:8081/`)
- Desktop (1280x800): HTTP 200, Body Len: 11,366 chars, 0 console errors, 0 page errors.
- Mobile (390x844): HTTP 200, Body Len: 10,703 chars, 0 horizontal overflow, 0 console errors.
- Screenshot artifacts preserved in `/screenshots/`.
