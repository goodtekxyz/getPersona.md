# Self-host smoke & release prep

> Post-MVP ops (TASK-013). Facts and checklists — not a deploy runbook for prod hosts yet.

## Quick smoke (developer machine)

Prereqs: Node **24**, pnpm **11.22**, Podman (or Postgres 17 on **5435** + Redis **6379**).

```bash
cp .env.example .env          # edit BETTER_AUTH_SECRET if needed
pnpm install
pnpm infra:up                 # podman compose: postgres + redis
pnpm auth:migrate             # Better Auth tables
./scripts/smoke-local.sh      # infra + API /health + /docs
./scripts/smoke-local.sh --full   # + turbo build typecheck test
```

Manual path (same as CI):

```bash
pnpm turbo run build typecheck test
pnpm dev                      # web :3000 + api :3001
```

Then in a browser:

1. `http://localhost:3000/ko/sign-up` — account
2. `http://localhost:3000/ko/personas/new` — persona
3. Swagger `http://localhost:3001/docs` — `POST /v1/write` (stub LLM if `LLM_WRAPPER_URL` unset)

## CI

- Workflow: `.github/workflows/ci.yml` (self-hosted runner, Node 24, `pnpm turbo run build typecheck test` + eslint).
- Skeleton copy kept at `docs/ci/github-actions-ci.yml` for reference.

## Release to `main` (human)

MVP is on `develop`. Production branch is `main` (`AGENTS.md`, `.vibeops.json`).

When self-host smoke passes on `develop`:

```bash
vibeops task ship TASK-013    # if this TASK is ready
vibeops task merge TASK-013
vibeops task sync TASK-013    # optional branch cleanup
vibeops task release          # develop → main (merge commit)
```

**Out of this TASK:** prod `compose.prod.yaml`, Caddy, GHCR images — see P2 in `08-roadmap.md`.

## Post-release (P2, not built)

| Item                 | Notes                                                         |
| -------------------- | ------------------------------------------------------------- |
| Container images     | `apps/api`, `apps/web` Dockerfiles                            |
| `compose.prod.yaml`  | blue/green slots + data layer (vibepulse/goodtek-web pattern) |
| Caddy                | `getpersona.md`, `api.getpersona.md`, `agent.getpersona.md`   |
| Infisical / secrets  | prod env on host                                              |
| `TYPEORM_SYNC=false` | migrations instead of sync in prod                            |

## Recorded smoke (2026-08-23)

| Check                                 | Result                                         |
| ------------------------------------- | ---------------------------------------------- |
| `podman compose` postgres + redis     | up (host 5435 / 6379)                          |
| `pnpm turbo run build typecheck test` | 9/9 tasks, api 70 tests, shared 15, web smoke  |
| `GET /health` with `.env`             | `{"status":"ok","product":"getPersona.md",…}`  |
| Node on runner                        | v22 warning (engines want 24); CI uses Node 24 |
