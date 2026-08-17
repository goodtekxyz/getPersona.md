# TASK-005: M1: Better Auth 가입·로그인 + 쿠키 .getpersona.md + web auth UI

## Status

In Progress

## Goal

M1: Better Auth 가입·로그인 + 쿠키 `.getpersona.md` + web auth UI so the API trusts the session.

## Scope

- Better Auth **1.6** on `apps/api` with email/password (SMTP/OAuth config stubs; local works without real SMTP).
- Persist users in Postgres via Better Auth **pg Pool** adapter (`DATABASE_URL`).
- Cookie domain: local host-only; document `AUTH_COOKIE_DOMAIN=.getpersona.md` for prod.
- Web signup + sign-in pages (DESIGN/LAYOUT/UX — dark lime).
- `GET /v1/me` returns current user when session cookie present; **401** otherwise.
- CORS whitelist for local web origin (+ credentials).
- next-intl ko/en skeleton.
- Update `docs/project/05-current-state.md` and this TASK Result / Test Result.

## Out of Scope

- Persona CRUD, agents, MCP, payments, admin.

## Acceptance Criteria

1. Sign up → sign in → session cookie → `GET /v1/me` returns the user.
2. Unauthenticated `GET /v1/me` returns 401.
3. `pnpm turbo run build typecheck test` passes.
4. Local auth works without SMTP; OAuth/SMTP remain env stubs.

## Test Plan

1. `podman compose up -d` (Postgres on host **5435**).
2. Copy `.env.example` → `.env`; run `pnpm --filter @getpersona/api auth:migrate`.
3. Start API + web (`API_PORT` / `NEXT_PUBLIC_*` aligned).
4. Sign up at `/en/sign-up`, sign in at `/en/sign-in`.
5. `curl -b cookies.txt http://localhost:$API_PORT/v1/me` after login cookie capture.
6. `pnpm turbo run build typecheck test`.

## Git Context

- Base Branch: `develop`
- Base Commit: `9be2a7b`
- Task Branch: `task/005-m1-better-auth-getpersona-md-web-auth-ui`
- Started At: `2026-08-17T01:53:52.238Z`

## Result

- Better Auth 1.6 on `apps/api` with email/password + pg `Pool` (`DATABASE_URL`).
- Auth routes at `/api/auth/*` via `@thallesp/nestjs-better-auth`; `GET /v1/me` returns session user or 401.
- Cookie: host-only locally; `AUTH_COOKIE_DOMAIN=.getpersona.md` documented for prod (`.env.example`, `09-stack.md`).
- CORS credentials whitelist via `TRUSTED_ORIGINS` / `WEB_ORIGIN`.
- SMTP/OAuth env stubs; local signup without real SMTP (`REQUIRE_EMAIL_VERIFICATION=false`).
- Web: `/[locale]/sign-up`, `/sign-in`, terms/privacy placeholders; next-intl ko/en; DESIGN dark lime tokens.
- Schema migrate: `pnpm auth:migrate` (`auth.$context.runMigrations()`).
- Compose Postgres host port **5435** (avoids local 5432 clashes).
- Docs: `05-current-state.md`, `09-stack.md`, `06-decisions.md` D-015, TASK Result/Test Result.

## Test Result

- `pnpm turbo run build typecheck test` — **9/9 successful** (env without `NODE_ENV` in `.env`; `NODE_ENV=development` in `.env` breaks `next build`).
- Manual API smoke (port 3101): `GET /health` 200; `GET /v1/me` without cookie **401**; `POST /api/auth/sign-up/email` + `sign-in/email` set `better-auth.session_token`; `GET /v1/me` with cookie **200** and user payload.
- `pnpm --filter @getpersona/api auth:migrate` applied `user` / `session` / `account` / `verification` tables.
