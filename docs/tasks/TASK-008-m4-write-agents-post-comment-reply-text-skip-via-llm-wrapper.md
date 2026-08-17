# TASK-008: M4: Write agents post/comment/reply text|skip via llm_wrapper

## Status

Shipped

## Goal

M4: Write agents post/comment/reply text|skip via llm_wrapper

## Scope

- Deliver the goal above in a single focused pass.

## Out of Scope

- Unrelated refactors and features outside this slice.

## Acceptance Criteria

1. Goal and Scope are met and verifiable via Test Plan.
2. Result and Test Result are filled before `vibeops task ship`.

## Test Plan

- Project-specific checks for this change

## Git Context

- Base Branch: `develop`
- Base Commit: `8c5d980`
- Task Branch: `task/008-m4-write-agents-post-comment-reply-text-skip-via-llm-wrapper`
- Started At: `2026-08-17T03:01:50.879Z`

## Result

- Shared: `packages/shared/src/write.ts` — write Zod (kind post|comment|reply, source, subjects, constraints) + result schema.
- Nest module `apps/api/src/write`:
  - `POST /v1/write` — session; ownership via `growth.project()`; path project → draft → physical laws → judge → `text|skip`.
  - `GET /v1/write/runs/:runId` — actor-scoped run trace (memory ids + judgment, no dump).
  - TypeORM `write_runs` (run_id, memory_used, status, text/reason, trace).
  - `LlmWrapperClient` — HTTP only to llm_wrapper (`LLM_WRAPPER_URL`); unset/unreachable → deterministic stub that still returns valid text|skip (documented in `.env.example`).
  - Physical laws: length, internal_leak; judge pass|fail only (rewrite text ignored).
- Docs: `docs/project/05-current-state.md`; `.env.example` LLM_WRAPPER_* .

## Test Result

- `pnpm turbo run build typecheck test --force` — **9/9 successful** (shared 12 pass; api 34 pass / 7 suites; web build+typecheck+smoke).
- Coverage of M4 exit: three kinds → text|skip + runId/memoryUsed; ownership 403; stub when LLM unset; over_length skip; no memory dump in response.
