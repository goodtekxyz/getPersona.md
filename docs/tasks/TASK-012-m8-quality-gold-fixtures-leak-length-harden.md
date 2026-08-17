# TASK-012: M8: Quality gold fixtures leak length harden

## Status

Shipped

## Goal

M8: Quality gold fixtures leak length harden

## Scope

- Deliver the goal above in a single focused pass.

## Out of Scope

- Unrelated refactors and features outside this slice.

## Acceptance Criteria

1. Goal and Scope are met and verifiable via Test Plan.
2. Result and Test Result are filled before `vibeops task ship`.

## Test Plan

- Gold fixtures for post/comment/reply assert pass shape or skip only (no golden answer text).
- Leak / length / language checks via `physical-laws` (+ write path skip).
- Docs: Postgres backup note + DESIGN/LAYOUT/UX drift checklist present.
- `pnpm turbo run build typecheck test` passes.
- `05-current-state` / `08-roadmap` / `10-dev-plan` mark M0–M8 done.

## Git Context

- Base Branch: `develop`
- Base Commit: `9f297de`
- Task Branch: `task/012-m8-quality-gold-fixtures-leak-length-harden`
- Started At: `2026-08-17T03:52:00.979Z`

## Result

- Gold fixtures: `apps/api/src/write/fixtures/gold-*.json` (post/comment/reply × pass|skip) + `gold-fixtures.spec.ts` — asserts `writeResultSchema` pass shape or skip only; never pins answer text.
- Physical laws: `languageFailCodes` / `wrong_language`; `writeLawCodes` now covers leak + length + language; wired in `write.service` (pre/post judge).
- Harden tests: leak/length/language unit cases + write skip on `internal_leak` / `wrong_language`.
- Docs: `docs/project/11-ops-backup.md` (PG dump/restore); `docs/project/UI-DRIFT-CHECKLIST.md`; README links.
- State: `05-current-state.md`, `08-roadmap.md`, `10-dev-plan.md` mark M0–M8 **Done** (TASK-004–012).

## Test Result

- `pnpm turbo run build typecheck test` — **9/9 successful** (shared 15 pass; api 70 pass / 16 suites incl. gold-fixtures + physical-laws; web build+typecheck+smoke).
- Leak fixture fails (`internal_leak`); length / language codes asserted; gold kinds return text|skip shapes without golden sentences.
