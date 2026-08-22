# getPersona.md

페르소나 등록·관리·성장 + Agent API (`post` / `comment` / `reply` → `text` \| `skip`).

## Docs

- Product & plan: [`docs/project/README.md`](docs/project/README.md)
- Dev milestones: [`docs/project/10-dev-plan.md`](docs/project/10-dev-plan.md)
- Self-host smoke: [`docs/project/12-self-host-smoke.md`](docs/project/12-self-host-smoke.md)

## Local dev

```bash
pnpm install
cp .env.example .env
pnpm infra:up          # Postgres 17 :5435, Redis :6379
pnpm auth:migrate
pnpm dev               # web :3000, api :3001
```

```bash
pnpm turbo run build typecheck test
./scripts/smoke-local.sh --full
```

## Stack

Next 16 + Nest 11 monorepo (pnpm + turbo). Better Auth, TypeORM, BullMQ, MCP on `apps/api`. LLM via **llm_wrapper** only.

## VibeOps

```bash
vibeops task add
vibeops task ship
vibeops task merge
vibeops task release   # develop → main when ready
```

See [`AGENTS.md`](AGENTS.md).
