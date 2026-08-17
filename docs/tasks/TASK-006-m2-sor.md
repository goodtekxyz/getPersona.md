# TASK-006: M2: 페르소나 SoR 등록·목록·조회·패치·보관·포크 + 계정 소속

## Status

Shipped

## Goal

M2: 페르소나 SoR 등록·목록·조회·패치·보관·포크 + 계정 소속

## Scope

- Deliver the goal above in a single focused pass.

## Out of Scope

- Unrelated refactors and features outside this slice.
- remember/promote, write agents, MCP, real sync (per M2 plan).

## Acceptance Criteria

1. Goal and Scope are met and verifiable via Test Plan.
2. Result and Test Result are filled before `vibeops task ship`.

## Test Plan

- `pnpm turbo run build typecheck test`
- Jest: PersonasService create/list/403/fork/archive
- Shared Zod: create/patch contract tests
- Manual (optional): session cookie CRUD + fork public + 403 private

## Git Context

- Base Branch: `develop`
- Base Commit: `24c2f24`
- Task Branch: `task/006-m2-sor`
- Started At: `2026-08-17T02:43:05.019Z`

## Result

- TypeORM `personas` entity (UUIDv7 id, ownerUserId, identity/voice/boundaries/permissions jsonb, isPublic, archivedAt, UTC timestamps); sync via `TYPEORM_SYNC` (default non-prod).
- Nest `/v1/personas`: POST create, GET list (owned, non-archived), GET :id, PATCH :id, POST :id/archive, POST :id/fork (public only). Ownership → 403 for others’ private personas.
- Zod contracts in `@getpersona/shared`; class-validator DTOs + ValidationPipe on API.
- Web (auth-gated): `/[locale]/personas`, `/personas/new`, `/personas/[id]` using DESIGN tokens.
- Docs: this TASK Result/Test Result; `docs/project/05-current-state.md` updated for M2.

## Test Result

- `pnpm turbo run build typecheck test` — **pass** (2026-08-17)
- `@getpersona/api` Jest: 7 tests (health + personas service ownership/fork/archive)
- `@getpersona/shared`: 5 tests (hosts + persona Zod)
- `@getpersona/web` Vitest smoke: pass; Next build includes personas routes
