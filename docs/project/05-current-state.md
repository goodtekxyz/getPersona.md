# Current state

> Facts only.

## Stage

- TASK-001–006 shipped (or present on develop) for M0–M2.
- TASK-007 (M3 Growth) **In Progress** on `task/007-m3-growth-remember-promote-project-promote-gate`.

## Product / stack

Docs `01`–`10` + `DESIGN.md` / `LAYOUT.md` / `UX.md`. Plan: [10-dev-plan.md](10-dev-plan.md).

## Active TASK

- `TASK-007` · M3 · In Progress

## Built

| Area       | State                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| UI SoR     | DESIGN / LAYOUT / UX locked (getdesign.app bench)                                                                           |
| Monorepo   | pnpm 11 + turbo; Next 16.3; Nest 11.2 (ESM)                                                                                 |
| Compose    | Postgres 17 (host **5435**) + Redis (`compose.yaml`)                                                                        |
| Auth       | Better Auth 1.6 on API (`/api/auth/*`); email/password; pg Pool                                                             |
| Web auth   | `/[locale]/sign-up`, `/sign-in`; next-intl ko/en; dark lime UI                                                              |
| Session    | Cookie host-only locally; `AUTH_COOKIE_DOMAIN=.getpersona.md` for prod                                                      |
| Me         | `GET /v1/me` — session user or 401                                                                                          |
| Personas   | TypeORM entity + `/v1/personas` CRUD/archive/fork; Zod in `@getpersona/shared`                                              |
| Web SoR UI | Auth-gated `/personas`, `/personas/new`, `/personas/[id]`                                                                   |
| Growth     | `/v1/growth` remember (idempotent) / promote (credential+gate) / project; episodes, candidates, ltm_memories, growth_audits |
| Promote    | Header `X-Promote-Credential` ≠ write session; identity/voice/boundary need `confirmGate`                                   |
| CI         | `docs/ci/github-actions-ci.yml` (self-hosted skeleton)                                                                      |

## Next step

Ship TASK-007 → M4 agents (write path).
