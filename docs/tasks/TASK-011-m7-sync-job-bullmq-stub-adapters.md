# TASK-011: M7: Sync job BullMQ + stub adapters

## Status

Shipped

## Goal

M7: Sync job BullMQ + stub adapters

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
- Base Commit: `76b970f`
- Task Branch: `task/011-m7-sync-job-bullmq-stub-adapters`
- Started At: `2026-08-17T03:39:30.215Z`

## Result

- Added `bullmq` (^6) to `apps/api`; Redis enqueue when `REDIS_URL` set, else in-process fallback.
- `apps/api/src/sync`: `sync_jobs` entity; `POST /v1/sync` + `GET /v1/sync/:jobId`; statuses queued/running/done/failed.
- Adapter interface + stub blog / X / Threads adapters (no scrape).
- Optional `S3ArtifactClient` stub (`S3_*` / `s3.goodtek.xyz`); always stubbed PUT.
- Post-process hook no-op (candidate/contract patch boundary).
- Shared Zod contracts in `@getpersona/shared` (`sync.ts`).
- Web: sync panel on persona detail with handle form + status polling (ko/en).
- Docs: `04-api`, `03-architecture`, `05-current-state`; `.env.example` S3 notes; `pnpm-workspace` `msgpackr-extract: false`.

## Test Result

- `pnpm turbo run build typecheck test` — pass (all packages).
- Unit: `sync-adapter.spec.ts`, `s3-artifact.client.spec.ts`, `sync.service.spec.ts` (enqueue→stub→done + failed post-process hook).
