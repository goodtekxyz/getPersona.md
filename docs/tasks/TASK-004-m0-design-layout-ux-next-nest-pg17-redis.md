# TASK-004: M0 — DESIGN/LAYOUT/UX 잠금 + 모노레포 스캐폴드

## Status

Shipped

## Goal

getDesign.md(https://www.getdesign.app)를 벤치마크해 `DESIGN.md`·`LAYOUT.md`·`UX.md`를 잠그고, 잠긴 스택으로 모노레포 스캐폴드가 build/typecheck/test·health까지 통과하게 한다.

## Scope

- `docs/project/DESIGN.md`, `LAYOUT.md`, `UX.md` (getdesign.app/design 벤치)
- pnpm + Turborepo: `@getpersona/web`, `@getpersona/api`, `@getpersona/shared`
- Podman Compose: Postgres 17, Redis
- ESLint / Prettier / Husky / lint-staged
- Jest(api) + Vitest(web) + shared node:test
- GH Actions self-hosted CI skeleton → `docs/ci/github-actions-ci.yml` (copy to `.github/workflows/` with workflow-scope token)
- Infisical run 스크립트 자리, Pino, Helmet
- docs current-state / README 갱신

## Out of Scope

- Better Auth, 페르소나 CRUD, agent, MCP
- 실 스크레이프, admin, 결제

## Acceptance Criteria

1. DESIGN/LAYOUT/UX 세 파일 존재
2. `pnpm turbo run build typecheck test` 성공
3. compose.yaml에 PG17+Redis
4. API `/health` → ok
5. 비즈니스 도메인 없음

## Test Plan

- 문서·README
- turbo build/typecheck/test
- curl `/health`
- vibeops status TASK-004

## Git Context

- Base Branch: `develop`
- Base Commit: `6c83f70`
- Task Branch: `task/004-m0-design-layout-ux-next-nest-pg17-redis`
- Started At: `2026-08-17T01:40:34.487Z`

## Result

M0 완료. getdesign.app/design 벤치로 UI SoR 잠금 + 모노레포 스캐폴드.

주요 경로:

- `docs/project/DESIGN.md`, `LAYOUT.md`, `UX.md`
- `apps/web` (Next 16.3), `apps/api` (Nest 11.2), `packages/shared`
- `compose.yaml`, `.github/workflows/ci.yml`, `scripts/infisical-run.sh`
- root `package.json` / `pnpm-workspace.yaml` / `turbo.json`

## Test Result

- `pnpm turbo run build typecheck test` — 9/9 successful
- `API_PORT=3011` → `GET /health` → `{"status":"ok","product":"getPersona.md",...}`
- DESIGN/LAYOUT/UX + README 링크 확인
