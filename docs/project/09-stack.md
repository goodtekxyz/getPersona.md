# Stack

> TASK-002가 버전까지 잠근 배선. 구현 스캐폴드는 후속 TASK.

## Monorepo

| Path | Package | Role |
|------|---------|------|
| `apps/web` | `@getpersona/web` | Next.js — 랜딩·가입·로그인·페르소나 UI |
| `apps/api` | `@getpersona/api` | NestJS — REST `/v1`, MCP, agent 모듈 |
| `packages/*` | `@getpersona/shared`, `@getpersona/agent-*`, … | 공유 스키마·에이전트 코어 |

- Workspace: **pnpm** + **Turborepo**
- Lint/format: ESLint 9 flat + Prettier · Husky + lint-staged
- Local infra: **Podman Compose** — Postgres 17 + Redis

## Versions (locked 2026-08-17)

| Layer | Choice | Version |
|-------|--------|---------|
| Node.js | Active LTS | **24** (engines `>=24 <25`) |
| pnpm | workspace | **11.22.x** |
| TypeScript | — | **5.9.x** |
| Turbo | — | **2.x** |
| Next.js | App Router | **16.3.x** |
| React | — | **19.2.x** |
| NestJS | Express adapter | **11.2.x** (+ Nest CLI 11) |
| DB | Postgres | **17** |
| ORM | TypeORM + `@nestjs/typeorm` | TypeORM **1.x**, nest typeorm **11** |
| Auth | Better Auth | **1.6.x** |
| Validation | class-validator (API DTO) + Zod (shared/agent) | **0.15** / **4.4** |
| Queue | Redis + BullMQ | BullMQ **6.x** |
| MCP | `@modelcontextprotocol/sdk` in `apps/api` | **1.30.x** |
| API docs | `@nestjs/swagger` | **11.4.x** |
| Log | Pino / nestjs-pino | pino **10** / nestjs-pino **4.6** |
| CSS (interim) | Tailwind → later align to getDesign.md | **4.3.x** |
| i18n | next-intl (ko/en) | **4.13.x** |
| Test | Jest (`apps/api`) + Vitest (`apps/web`) | — |
| Object storage | S3-compatible | **`s3.goodtek.xyz`** |
| Secrets | Infisical | — |
| Mail | Self-hosted SMTP | — |
| CI | GitHub Actions **self-hosted** runners | — |
| Deploy | Self-host (Podman/VM) | — |
| LLM | **llm_wrapper gateway only** | — |
| IDs | ULID / UUIDv7 | — |
| Time | UTC in DB/API; local in UI | — |

## Hosts

| Host | Surface |
|------|---------|
| `getpersona.md` | Web product |
| `agent.getpersona.md` | Agent collective (post / comment / reply, …) |
| `api.getpersona.md` | Connection methods: REST `/v1` + MCP |

내부적으로 `agent.`와 `api.`는 **같은 `apps/api` 프로세스**를 가리킨다 (리버스 프록시). 에이전트↔코어는 in-process DI이며 HTTP 홉이 아니다.

세션 쿠키: **`.getpersona.md`** 공유 (Better Auth).

CORS: 위 호스트(+ www)와 로컬 dev 화이트리스트.

## Agent absorption

`personaAgent`의 포스팅·댓글·대댓글 영역을 **각각의 에이전트**로 `getPersona.md`에 흡수한다. 코드 이전은 구현 TASK. 게시를 위한 브라우저/스케줄러는 여전히 본체 밖일 수 있으나, **싱크용 어댑터 경계**는 후속 TASK에서 연다.

## Explicitly deferred

- Feature flags, OpenTelemetry, payments
- `admin.getpersona.md`
- Platform adapter implementations (blog / X / Threads)
- Tailwind → getDesign.md visual alignment pass
- CSP hardening beyond baseline Helmet headers
