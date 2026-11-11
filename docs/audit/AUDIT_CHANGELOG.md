# AUDIT_CHANGELOG.md — Audit Documentation Changelog

## [2026-11-12] Complete Engineering Audit, Hardening & Verification Pass

### Created & Updated Documentation in `/docs/audit/`:
- `/docs/audit/PROJECT_OVERVIEW.md`: System architecture, technologies, component communication diagrams.
- `/docs/audit/FEATURE_INVENTORY.md`: Comprehensive status matrix of all 16 platform features.
- `/docs/audit/COMPLETED_WORK.md`: Log of verified endpoints, UI routes, and test suites.
- `/docs/audit/BUGS_AND_ISSUES.md`: Discovery log and resolution details for 11 defects/vulnerabilities.
- `/docs/audit/PENDING_WORK.md`: Master checklist of future enhancements with acceptance criteria.
- `/docs/audit/TEST_RESULTS.md`: Detailed test execution metrics (267/267 unit tests passed + E2E journey passed) and Playwright verdicts.
- `/docs/audit/SECURITY_AUDIT.md`: Security analysis, risk ratings, and credential handling audit.
- `/docs/audit/IMPLEMENTATION_ROADMAP.md`: Sequenced phase roadmap from hardening to scale.
- `/docs/audit/PROJECT_HEALTH_REPORT.md`: Executive scorecard (97.7/100 composite score).
- `/docs/audit/AUDIT_CHANGELOG.md`: Record of audit artifacts and revisions.

### Codebase Modifications & Implementations:
1. `src/lib/advisor-chat.server.ts`:
   - Redacted hardcoded `GEMINI_DEFAULT_KEY` and `OPENROUTER_DEFAULT_KEY`.
   - Wired `process.env.GEMINI_API_KEY` and `process.env.OPENROUTER_API_KEY` with graceful local advisor fallback.
   - Implemented sliding-window rate limiter (`checkAdvisorRateLimit`) capping requests at 25/min per client ID.
   - Exported `generateLocalAdvisorResponse` and `generateContextualSuggestions` for direct unit testing.
2. `src/lib/project-hub.server.ts`:
   - Redacted hardcoded `TURSO_AUTH_TOKEN`.
   - Wired `process.env.TURSO_AUTH_TOKEN` with safe deep-link fallback.
3. `src/lib/trustmrr.server.ts`:
   - Added timeout catch and `FALLBACK_STARTUPS` dataset to prevent route loader crash.
   - Added `getFallbackProfile` for offline / rate-limited startup lookups.
4. `vite.config.ts`, `scripts/with-app-env.mjs`, `startup.sh`:
   - Configured `watch.ignored` list and `CHOKIDAR_USEPOLLING=1` fallback, eliminating `EMFILE: too many open files` crash on Linux.
5. `src/components/brief-view.tsx`:
   - Appended iteration indices to React key props across review and complaint list items, resolving duplicate key runtime warnings.
6. `src/lib/use-pwa-install.ts` & `src/components/pwa-install.tsx`:
   - Extracted custom hook into standalone module, resolving Fast Refresh warning and bringing ESLint to 0 errors and 0 warnings.
7. `scripts/e2e-journey.mjs` & `package.json`:
   - Added automated Playwright end-to-end journey test verifying homepage, desk switching, search, dossier view, All Links modal, and bookmarks with 0 console errors.
8. `src/lib/format.test.ts` & `src/lib/advisor-chat.test.ts`:
   - Added 27 new automated unit tests verifying formatting, slug validation, security constraints, rate limiting, and local AI fallback.
9. `scripts/browser-smoke-verdict.test.mjs` & `scripts/grok-pwa-plugin.test.mjs`:
   - Updated path matching and directory isolation so all 87 plugin and smoke verdict tests pass.
10. `eslint.config.mjs`:
   - Added `.wrangler/**` to `ignores`.
