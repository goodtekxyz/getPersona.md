# TASK-009: M5 — Connect API keys + Swagger + rate limit

## Status

In Progress

## Goal

API keys (hash-only), Swagger, Redis rate limit, Bearer or session auth for connect surface.

## Scope

- API key CRUD (create shows once), sha256 hash storage
- write vs promote scopes
- Redis rate limit
- Swagger /docs
- Public allowlist for public personas

## Out of Scope

- MCP, sync scrapers

## Acceptance Criteria

1. Key create/list/revoke; hash only in DB
2. Bearer key works for /v1 write
3. Rate limit enforced
4. Swagger available
5. turbo green

## Test Plan

- turbo build/typecheck/test
- api-keys + rate-limit unit tests

## Git Context

- Task Branch: `task/009-m5-connect-v1-api-keys-hash-swagger-rate-limit-redis`

## Result

- `apps/api/src/api-keys` — create/list/revoke; hash-only; write/promote scopes
- `apps/api/src/rate-limit` — Redis window limiter
- Actor auth session or Bearer key (`auth/actor.ts`)
- Swagger wired in main; public decorator for allowlisted routes
- Shared Zod `packages/shared/src/api-key.ts`

## Test Result

- `pnpm --filter @getpersona/api test` — 10 suites / 42 tests pass
- `pnpm turbo run build typecheck test` — run before ship
