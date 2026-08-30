# Current state

> Facts only.

## Stage

- **MVP complete** on `develop`: TASK-001–012 **Shipped**, milestones **M0–M8** done.
- **P1 complete**: TASK-013 (smoke + CI + release prep) **Shipped**.
- **Governance**: TASK-014 **Shipped**.
- **Docs synced**: TASK-015–016 **Shipped** (facts match vibeops).
- No active TASK.

## Product / stack

Docs `01`–`12` + `DESIGN.md` / `LAYOUT.md` / `UX.md` + `UI-DRIFT-CHECKLIST.md`. Plan: [10-dev-plan.md](10-dev-plan.md). Ops: [12-self-host-smoke.md](12-self-host-smoke.md). Governance: `.cursor/rules/00-governance.mdc`.

## Active TASK

(none)

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
| Sync        | BullMQ + stub adapters (blog / X / Threads)                                     |
| CI          | `.github/workflows/ci.yml` (self-hosted, Node 24)                               |
| Local smoke | `scripts/smoke-local.sh` + `12-self-host-smoke.md`                              |
| Governance  | VibeOps lifecycle + 정공법 (`00-governance.mdc`, D-010)                         |

## Connect surface (what this product exposes)

| Target                            | Status                   | Notes                                |
| --------------------------------- | ------------------------ | ------------------------------------ |
| Web `getpersona.md`               | Built (local)            | Landing, auth, persona UI            |
| Agent `agent.getpersona.md`       | Built in-process         | Same Nest as api; post/comment/reply |
| Connect `api.getpersona.md`       | Built (local)            | REST `/v1` + MCP `/mcp`              |
| Clients (API key / MCP)           | Built                    | Cursor MCP example in `04-api.md`    |
| llm_wrapper                       | Wired                    | Only LLM path; stub if URL unset     |
| Sync sources (blog / X / Threads) | Boundary only            | Stub adapters; no real scrape        |
| S3 `s3.goodtek.xyz`               | Stub                     | Artifact client stub                 |
| personaLoop (publish client)      | Adjacent, not built here | May call this API later              |
| Prod hosts / Caddy                | Not built                | P2                                   |

## Not built (post-MVP)

`vibeops task release` to `main` · prod compose/Caddy · real sync scrapers · admin / payments / OTel

## Next step

`vibeops task release` (ops) or `vibeops task add` for P2 prod deploy / P3 real sync.
