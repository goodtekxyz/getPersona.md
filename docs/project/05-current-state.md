# Current state

> Facts only.

## Stage

- TASK-001–005 shipped (or present on develop) for M0–M1.
- TASK-006 (M2 Persona SoR) **In Progress** on `task/006-m2-sor`.

## Product / stack

Docs `01`–`10` + `DESIGN.md` / `LAYOUT.md` / `UX.md`. Plan: [10-dev-plan.md](10-dev-plan.md).

## Active TASK

- `TASK-006` · M2 · In Progress

## Built

| Area       | State                                                                          |
| ---------- | ------------------------------------------------------------------------------ |
| UI SoR     | DESIGN / LAYOUT / UX locked (getdesign.app bench)                              |
| Monorepo   | pnpm 11 + turbo; Next 16.3; Nest 11.2 (ESM)                                    |
| Compose    | Postgres 17 (host **5435**) + Redis (`compose.yaml`)                           |
| Auth       | Better Auth 1.6 on API (`/api/auth/*`); email/password; pg Pool                |
| Web auth   | `/[locale]/sign-up`, `/sign-in`; next-intl ko/en; dark lime UI                 |
| Session    | Cookie host-only locally; `AUTH_COOKIE_DOMAIN=.getpersona.md` for prod         |
| Me         | `GET /v1/me` — session user or 401                                             |
| Personas   | TypeORM entity + `/v1/personas` CRUD/archive/fork; Zod in `@getpersona/shared` |
| Web SoR UI | Auth-gated `/personas`, `/personas/new`, `/personas/[id]`                      |
| CI         | `docs/ci/github-actions-ci.yml` (self-hosted skeleton)                         |

## Next step

Ship TASK-006 → M3 growth (remember/promote).
