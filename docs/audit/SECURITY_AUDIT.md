# SECURITY_AUDIT.md — Security Posture & Remediation

**Audit Conducted**: 2026-11-12  
**Overall Security Rating**: **STRONG** (Post-Remediation)

---

## 1. Vulnerability Findings & Status

| ID | Category | Severity | Title | Status |
|---|---|---|---|---|
| **SEC-01** | Credential Exposure | **CRITICAL** | Hardcoded AI API Keys in Source Control | **RESOLVED** |
| **SEC-02** | Credential Exposure | **HIGH** | Hardcoded Database Access Token (Turso JWT) | **RESOLVED** |
| **SEC-03** | Injection / XSS | **LOW** | User Search Query Rendering | **SECURE / VERIFIED** |
| **SEC-04** | SSRF / Network Boundaries | **LOW** | External URL Ingestion | **SECURE / VERIFIED** |
| **SEC-05** | Authentication Invariants | **INFORMATIONAL**| Dev vs Production Auth Flag Agreement | **SECURE / VERIFIED** |

---

## 2. Detailed Security Analysis

### SEC-01: Hardcoded AI API Keys
- **Severity**: **CRITICAL**
- **Analysis**: Lines 29-33 of `src/lib/advisor-chat.server.ts` contained hardcoded keys for Google Gemini and OpenRouter.
- **Remediation**: Credentials were fully removed. Code now reads exclusively from `process.env.GEMINI_API_KEY` and `process.env.OPENROUTER_API_KEY`. When unset, it executes `generateLocalAdvisorResponse`, guaranteeing zero operational disruption.

### SEC-02: Hardcoded Database Token
- **Severity**: **HIGH**
- **Analysis**: Lines 32-33 of `src/lib/project-hub.server.ts` contained a Turso pipeline JWT token.
- **Remediation**: Token removed. Replaced with `process.env.TURSO_AUTH_TOKEN`. Pipeline execution is guarded and falls back safely to query-parameter deep linking.

### SEC-03: Injection & XSS Protection
- **Severity**: **LOW** (Mitigated)
- **Analysis**: All external strings (Reddit titles, App Store reviews, Product Hunt comments) are sanitized through `stripHtml()` and HTML entities escaping (`escapeHtml()`) before being rendered into the DOM.
- **Verification**: React 19 automatic JSX string escaping prevents unescaped script tag injection. No dangerous `dangerouslySetInnerHTML` usage exists in user-controllable text paths.

### SEC-04: SSRF & URL Validation
- **Severity**: **LOW** (Mitigated)
- **Analysis**: In `src/lib/format.ts`, `isSafeHitId` and `isSafeSlug` enforce strict alphanumeric and hyphen patterns (`/^[a-z0-9-]+$/`).
- **Protection**: Prevents path traversal, file URL manipulation (`file:///`), or local network loopback probing via opportunity parameters.
- Browser test scripts enforce loopback restrictions (`checkedUrl`, `checkedOutputPath`) preventing arbitrary file inspection or exfiltration.

### SEC-05: Auth & Tenant Isolation
- Better Auth is isolated per app configuration via `.grok/app-env.json`.
- `scripts/check-auth-invariant.mjs` verifies agreement between development servers and production builds to ensure unauthenticated routes never accidentally leak authenticated endpoints.
