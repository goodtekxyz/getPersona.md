# Current state

> Facts only.

## Stage

- TASK-001–004 **Shipped** (or M0 scaffold present on develop).
- TASK-005 (M1 Better Auth) **In Progress** on `task/005-m1-better-auth-getpersona-md-web-auth-ui`.

## Product / stack

Docs `01`–`10` + `DESIGN.md` / `LAYOUT.md` / `UX.md`. Plan: [10-dev-plan.md](10-dev-plan.md).

## Active TASK

- `TASK-005` · M1 · In Progress

## Built

| Area     | State                                                                  |
| -------- | ---------------------------------------------------------------------- |
| UI SoR   | DESIGN / LAYOUT / UX locked (getdesign.app bench)                      |
| Monorepo | pnpm 11 + turbo; Next 16.3; Nest 11.2 (ESM)                            |
| Compose  | Postgres 17 (host **5435**) + Redis (`compose.yaml`)                   |
| Auth     | Better Auth 1.6 on API (`/api/auth/*`); email/password; pg Pool        |
| Web auth | `/[locale]/sign-up`, `/sign-in`; next-intl ko/en; dark lime UI         |
| Session  | Cookie host-only locally; `AUTH_COOKIE_DOMAIN=.getpersona.md` for prod |
| Me       | `GET /v1/me` — session user or 401                                     |
| CI       | `docs/ci/github-actions-ci.yml` (self-hosted skeleton)                 |

## Next step

Ship TASK-005 → M2 persona SoR.
