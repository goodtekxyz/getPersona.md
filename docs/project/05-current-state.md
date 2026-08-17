# Current state

> Facts only.

## Stage

- TASK-001–011 shipped (or present on develop) for M0–M7.
- TASK-012 (M8 Quality & harden) **In Progress** on `task/012-m8-quality-gold-fixtures-leak-length-harden`.
- Plan milestones **M0–M8** are implemented (MVP plan complete pending TASK-012 ship/merge).

## Product / stack

Docs `01`–`11` + `DESIGN.md` / `LAYOUT.md` / `UX.md` + `UI-DRIFT-CHECKLIST.md`. Plan: [10-dev-plan.md](10-dev-plan.md).

## Active TASK

- `TASK-012` · M8 · In Progress

## Built

| Area       | State                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| UI SoR     | DESIGN / LAYOUT / UX locked (getdesign.app bench); drift checklist `UI-DRIFT-CHECKLIST.md`                    |
| Monorepo   | pnpm 11 + turbo; Next 16.3; Nest 11.2 (ESM)                                                                   |
| Compose    | Postgres 17 (host **5435**) + Redis (`compose.yaml`); backup note `11-ops-backup.md`                          |
| Auth       | Better Auth 1.6 on API (`/api/auth/*`); email/password; pg Pool                                               |
| Web auth   | `/[locale]/sign-up`, `/sign-in`; next-intl ko/en; dark lime UI                                                |
| Session    | Cookie host-only locally; `AUTH_COOKIE_DOMAIN=.getpersona.md` for prod                                        |
| Me         | `GET /v1/me` — session user or API key owner                                                                  |
| Personas   | TypeORM entity + `/v1/personas` CRUD/archive/fork; Zod in `@getpersona/shared`                                |
| Web SoR UI | Auth-gated `/personas`, `/personas/new`, `/personas/[id]` (+ sync panel)                                      |
| Growth     | `/v1/growth` remember / promote (promote scope) / project; episodes, candidates, ltm_memories, growth_audits  |
| Promote    | API key `promote` scope or session operator; write-only key → 403; identity/voice/boundary need `confirmGate` |
| Write      | `POST /v1/write` project→draft→judge→text\|skip; llm_wrapper or stub; `write_runs` trace; physical laws       |
| Quality    | Gold fixtures (pass shape \| skip); leak / length / language checks (`physical-laws`)                         |
| Sync       | BullMQ (+ in-process fallback); stub blog/X/Threads adapters; S3 artifact stub; `POST/GET /v1/sync`           |
| API keys   | `/v1/api-keys` create (plaintext once) / list / revoke; sha256 hash only; scopes write\|promote               |
| Rate limit | Redis fixed window via ioredis (memory fallback); per account + per key (`/v1` and `/mcp`)                    |
| Swagger    | `@nestjs/swagger` UI at `/docs`                                                                               |
| Public     | `GET /v1/personas/:id` allowlisted; body only when `isPublic`                                                 |
| MCP        | `POST /mcp` Streamable HTTP (stateless); Bearer API key; tools list/get/write/remember → Nest services        |
| CI         | `docs/ci/github-actions-ci.yml` (self-hosted skeleton)                                                        |

## Next step

Ship TASK-012 (M8) → MVP plan M0–M8 complete on develop after merge.
