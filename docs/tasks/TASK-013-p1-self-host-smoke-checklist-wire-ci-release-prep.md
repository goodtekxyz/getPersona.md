# TASK-013: P1: self-host smoke checklist + wire CI + release prep

## Status

In Progress

## Goal

MVP 완료 후 운영 단계(P1): 셀프호스트 smoke를 문서·스크립트로 고정하고, CI를 `.github/workflows`에 연결하며, `vibeops task release` 전 체크리스트를 남긴다.

## Scope

- `docs/project/05-current-state.md` · `08-roadmap.md`를 M8 Done / post-MVP 상태로 갱신한다.
- `docs/project/12-self-host-smoke.md` — smoke + release prep 체크리스트.
- `scripts/smoke-local.sh` — infra + API `/health` (+ `--full` 시 turbo).
- `.github/workflows/ci.yml` — `docs/ci/github-actions-ci.yml`과 동일하게 연결.
- 루트 `README.md` — 로컬 dev·smoke 진입점.
- `docs/project/README.md`에 `12-self-host-smoke.md` 링크.

## Out of Scope

- `compose.prod.yaml`, Dockerfile, Caddy, GHCR 배포
- `vibeops task release` 실행 (사람)
- 실 sync 스크레이퍼, admin, 결제

## Acceptance Criteria

1. `05-current-state`가 MVP 완료·TASK-013 활성을 반영한다.
2. `12-self-host-smoke.md`에 quick smoke, CI, release 명령이 있다.
3. `./scripts/smoke-local.sh`가 `/health` 200을 검증한다.
4. `.github/workflows/ci.yml`이 존재하고 `docs/ci`와 동일한 job이다.
5. Result / Test Result가 채워져 있다.

## Test Plan

- `./scripts/smoke-local.sh` 성공
- `./scripts/smoke-local.sh --full` 또는 `pnpm turbo run build typecheck test` 성공
- `diff docs/ci/github-actions-ci.yml .github/workflows/ci.yml` — job steps 동일
- 문서 링크: README → `12-self-host-smoke.md`

## Git Context

- Base Branch: `develop`
- Base Commit: `27cab24`
- Task Branch: `task/013-p1-self-host-smoke-checklist-wire-ci-release-prep`
- Started At: `2026-08-22T19:45:54.406Z`

## Result

- MVP 문서 상태 갱신: `05-current-state.md`, `08-roadmap.md` (M0–M8 Done, P1 post-MVP).
- Ops: `docs/project/12-self-host-smoke.md`, `scripts/smoke-local.sh`, root `README.md`.
- CI: `.github/workflows/ci.yml` wired (self-hosted, Node 24, turbo + eslint).
- Index: `docs/project/README.md` → `12-self-host-smoke.md`.

## Test Result

- `./scripts/smoke-local.sh` — `/health` ok, `/docs` 200 (2026-08-23).
- `pnpm turbo run build typecheck test` — 9/9 tasks, api 70 tests (2026-08-23).
- `diff docs/ci/github-actions-ci.yml .github/workflows/ci.yml` — identical job steps.
