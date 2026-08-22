# Current state

> Facts only.

## Stage

- **MVP complete** on `develop`: TASK-001–012 **Shipped**, milestones **M0–M8** done.
- **TASK-013** (P1 ops: smoke + CI + release prep) **In Progress** on `task/013-p1-self-host-smoke-checklist-wire-ci-release-prep`.

## Product / stack

Docs `01`–`12` + `DESIGN.md` / `LAYOUT.md` / `UX.md` + `UI-DRIFT-CHECKLIST.md`. Plan: [10-dev-plan.md](10-dev-plan.md). Ops: [12-self-host-smoke.md](12-self-host-smoke.md).

## Active TASK

- `TASK-013` · P1 self-host smoke + CI + release prep · In Progress

## Built

| Area        | State                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| UI SoR      | DESIGN / LAYOUT / UX locked; `UI-DRIFT-CHECKLIST.md`                            |
| Monorepo    | pnpm 11 + turbo; Next 16.3; Nest 11.2 (ESM)                                     |
| Compose     | Postgres 17 (host **5435**) + Redis (`compose.yaml`); backup `11-ops-backup.md` |
| Auth        | Better Auth 1.6; web sign-up/sign-in                                            |
| Personas    | CRUD / archive / fork + web UI                                                  |
| Growth      | remember / promote / project + gates                                            |
| Write       | post / comment / reply → text \| skip; physical laws; gold fixtures             |
| Connect     | `/v1` + API keys + Swagger + rate limit                                         |
| MCP         | Streamable HTTP on `/mcp`                                                       |
| Sync        | BullMQ + stub adapters                                                          |
| CI          | `.github/workflows/ci.yml` (self-hosted, Node 24)                               |
| Local smoke | `scripts/smoke-local.sh` + `12-self-host-smoke.md`                              |

## Not built (post-MVP)

Prod compose/deploy · `main` release · real sync scrapers · admin / payments / OTel

## Next step

Ship TASK-013 → human runs `vibeops task release` when smoke passes on develop → P2 prod deploy.
