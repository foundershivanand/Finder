# PENDING_WORK.md — Pending Tasks & Master Checklist

This checklist details remaining operational tasks and future scale enhancements categorized by priority and domain.

---

## 1. Master Task Status Table

| Task ID | Task Name | Domain | Priority | Complexity | Status |
|---|---|---|---|---|---|
| **TASK-01** | Production Environment Secret Injection | DevOps / Security | **P0** | Small | **PENDING DEPLOYMENT** (Requires provider UI credentials) |
| **TASK-02** | Rate Limiting on Chat Advisor Endpoint | Backend / Security | **P1** | Medium | **COMPLETED & VERIFIED** (`checkAdvisorRateLimit` active) |
| **TASK-03** | Cloudflare Workers KV Cache Adapter | Performance | **P1** | Medium | **BACKLOG** (Requires Cloudflare account / binding) |
| **TASK-04** | E2E Browser Journey Test Suite | QA | **P2** | Medium | **COMPLETED & VERIFIED** (`scripts/e2e-journey.mjs`) |
| **TASK-05** | Real-time Webhook Ingestion from Reddit/PH | Backend | **P2** | Large | **BACKLOG** (Requires external API developer accounts) |
| **TASK-06** | User Account & Cloud Sync (Optional Auth) | Full-Stack | **P3** | Large | **BACKLOG** (Database deployment decision) |

---

## 2. Actionable Deployment Steps

### TASK-01: Production Environment Secret Injection
- **Description**: Configure `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, and `TURSO_AUTH_TOKEN` in production hosting provider settings (Cloudflare Pages or Vercel).
- **Current Fallback State**: The application runs flawlessly even without these keys by using deterministic offline intelligence (`generateLocalAdvisorResponse`) and deep-link query parameter exports to Project Manage. Setting these variables enables live external LLM generation and direct database pipeline syncing.
- **Implementation Approach**:
  1. Go to Cloudflare Pages Dashboard -> Settings -> Environment Variables.
  2. Add `GEMINI_API_KEY` (secret).
  3. Add `OPENROUTER_API_KEY` (secret, optional secondary failover).
  4. Add `TURSO_AUTH_TOKEN` (secret, optional direct database writes).
- **Acceptance Criteria**: External LLM generation activates on production routes when keys are configured.
