# TASK-007: M3: Growth remember/promote/project + promote gate

## Status

In Progress

## Goal

M3: Growth remember/promote/project + promote gate

## Scope

- Deliver the goal above in a single focused pass.

## Out of Scope

- Unrelated refactors and features outside this slice.
- M4 write agents, M5 hashed API keys / Swagger.

## Acceptance Criteria

1. Goal and Scope are met and verifiable via Test Plan.
2. Result and Test Result are filled before `vibeops task ship`.

## Test Plan

- Unit: remember idempotency; promote → LTM → project window; identity gate; promote credential helper.
- Shared Zod schemas for remember / promote / project.
- `pnpm turbo run build typecheck test` green.

## Git Context

- Base Branch: `develop`
- Base Commit: `596696e`
- Task Branch: `task/007-m3-growth-remember-promote-project-promote-gate`
- Started At: `2026-08-17T02:53:33.985Z`

## Result

- Shared: `packages/shared/src/growth.ts` — remember / promote / project Zod + `requiresPromoteGate`.
- TypeORM tables: `episodes` (unique persona+sourceKind+sourceId), `candidates`, `ltm_memories`, `growth_audits`.
- Nest module `apps/api/src/growth`:
  - `POST /v1/growth/remember` — session; episode + pending candidate; idempotent on source key.
  - `GET /v1/growth/candidates?personaId=` — owner list.
  - `POST /v1/growth/promote` — session + `X-Promote-Credential` (env `PROMOTE_CREDENTIAL`); write session alone cannot promote; identity/voice/boundary need `confirmGate: true` and patch persona SoR.
  - `POST /v1/growth/project` — narrow contract + LTM memory window (no dump).
- Audit rows written on remember (first write) and promote.
- Docs: `docs/project/05-current-state.md`; `.env.example` `PROMOTE_CREDENTIAL`.

## Test Result

- `pnpm turbo run build typecheck test --force` — **9/9 successful** (shared 9 pass; api 15 pass / 4 suites; web build+typecheck+smoke).
- Coverage of M3 exit: remember idempotent; promote fact → LTM → project window; identity needs `confirmGate`; `requirePromoteCredential` rejects missing/wrong/unconfigured header.
