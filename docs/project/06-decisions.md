# Decisions

> Append-only log. Add bullets when a TASK locks a choice — do not rewrite history.

## D-001 · VibeOps workflow

- **Date:** 2026-08-16T22:58:45.107Z
- **Decision:** TASK-driven development with `vibeops task add` / `task ship` / `merge` / `sync` and Cursor for plan/build. TASK status: **In Progress** → **Shipped** only.
- **Why:** Git `docs/tasks` beats chat as source of truth.

## D-002 · Persona platform

- **Date:** 2026-08-17
- **Decision:** 이 레포의 제품은 페르소나 등록·관리·성장과, 그 페르소나로 글을 쓰는 Agent API다.
- **Why:** 쓰기만 있으면 래퍼고, 등록만 있으면 주소록이다. 네 능력은 한 제품이다.

## D-003 · Kinds are writing, not the graph

- **Date:** 2026-08-17
- **Decision:** `post` / `comment` / `reply`는 글 종류다. 소셜 트리는 입력 맥락이다. 상황 케이스 표를 제품에 넣지 않는다.
- **Why:** 열린 장면을 열거할 수 없다. 종류는 형식 힌트이지 고정 경로가 아니다.

## D-004 · Persona is the original

- **Date:** 2026-08-17
- **Decision:** 페르소나 계약이 SoR이다. 글은 투영이다. 매 호출에 페르소나 전문을 보내지 않는다. API는 memory dump를 돌려주지 않는다.
- **Why:** 통째로 넣으면 느리고 새고 계정이 섞인다.

## D-005 · Gated growth

- **Date:** 2026-08-17
- **Decision:** 관찰은 `remember`로 후보가 된다. LTM은 `promote`만 만든다. 쓰기 경로가 정체성·보이스·경계를 직접 덮지 않는다.
- **Why:** 한 번의 피드백이 헌법을 바꾸면 다음 글이 무너진다.

## D-006 · Agent API, not a publisher

- **Date:** 2026-08-17
- **Decision:** 제품 표면은 Agent API다. 게시·브라우저·스케줄·피드 수집은 본체 밖(클라이언트)이다. `skip`은 성공이다.
- **Why:** 본체는 페르소나와 문장이다. 게시 채널은 바뀐다.

## D-007 · Split write and promote credentials

- **Date:** 2026-08-17
- **Decision:** 쓰기 토큰과 승격 토큰을 나눈다. 쓰기가 LTM을 쓰지 못한다.
- **Why:** 실수와 자동 루프가 기억을 오염시키지 못하게 한다.

## D-008 · Policy in the persona, not engine branches

- **Date:** 2026-08-17
- **Decision:** 계정·페르소나 차이는 계약에 산다. 엔진 코드에 계정 이름 분기를 넣지 않는다.
- **Why:** 새 페르소나가 코드 변경을 요구하면 플랫폼이 아니다.

## D-009 · Stack and engine reuse unlocked

- **Date:** 2026-08-17
- **Decision:** 언어, DB, HTTP 프레임워크, personaAgent 재사용 여부는 이 TASK에서 잠그지 않는다.
- **Why:** 기획이 잠글 것은 제품이다. 배선은 설계 TASK의 결정이다.

## D-010 · Full product surface in this repo

- **Date:** 2026-08-17
- **Decision:** getPersona.md는 웹(랜딩·가입·로그인·등록·싱크·포크)과 agent·API/MCP를 모두 이 레포에서 구현한다. getDesign.md는 디자인·UX 벤치마크만.
- **Why:** 제품과 벤치마크를 분리하고, 구현 단일 레포를 유지한다.

## D-011 · Hosts and one API process

- **Date:** 2026-08-17
- **Decision:** `getpersona.md`(web), `agent.getpersona.md`(에이전트 표면), `api.getpersona.md`(REST/MCP). agent와 api는 같은 Nest 프로세스. 쿠키는 `.getpersona.md`.
- **Why:** 공개 네임스페이스는 나누고, 내부 HTTP 홉은 피한다.

## D-012 · Stack versions (TASK-002)

- **Date:** 2026-08-17
- **Decision:** Node 24 LTS, pnpm 11.22, TS 5.9, Next 16.3, React 19.2, NestJS 11.2 (Express), Postgres 17, TypeORM, Better Auth 1.6, BullMQ+Redis, Zod+class-validator, MCP SDK in api, Pino, Infisical, Podman Compose, GH Actions self-hosted, S3 at s3.goodtek.xyz, llm_wrapper only. 상세는 `09-stack.md`.
- **Why:** LTS·서로 호환되는 최신 안정 조합. Nest 정공법(TypeORM/Express/Swagger).

## D-013 · personaAgent absorption

- **Date:** 2026-08-17
- **Decision:** personaAgent의 post/comment/reply를 getPersona.md agent로 **각각 에이전트**로 흡수한다. 코드 이전은 구현 TASK.
- **Why:** 쓰기 품질 엔진을 제품 agent 면으로 옮긴다. D-009의 미결을 닫는다.

## D-014 · Access model

- **Date:** 2026-08-17
- **Decision:** 작업은 계정 소속 페르소나만. API 키는 해시 저장. 퍼블릭은 명시한 페르소나·엔드포인트만.
- **Why:** 기본 비공개. 키 원문 재노출을 막는다.

## D-015 · Better Auth on API (M1)

- **Date:** 2026-08-17
- **Decision:** Better Auth 1.6 runs in `apps/api` (`/api/auth/*`, pg Pool). Web uses `better-auth/react` against `NEXT_PUBLIC_API_URL`. Local cookies are host-only; production sets `AUTH_COOKIE_DOMAIN=.getpersona.md`. SMTP/OAuth are env stubs; `REQUIRE_EMAIL_VERIFICATION` stays false until SMTP is real. `apps/api` is ESM (`"type": "module"`) so Better Auth loads cleanly.
- **Why:** Architecture places Auth on the Nest process; shared cookie domain needs the API to mint the session for `/v1/me`.

## D-016 · Connect keys + scopes (M5)

- **Date:** 2026-08-17
- **Decision:** API keys store sha256 only; plaintext returned once. Auth is Bearer key or session. Key scopes are `write` and/or `promote` (D-007); session operators have both. Env `PROMOTE_CREDENTIAL` retired. Rate limit via Redis (ioredis) fixed window per account and key. OpenAPI at `/docs`. Public reads require both route allowlist and `persona.isPublic`.
- **Why:** Connect surface for `api.getpersona.md` without re-exposing secrets or letting write automation promote LTM.

## D-017 · MCP on same Nest core (M6)

- **Date:** 2026-08-17
- **Decision:** MCP runs in `apps/api` via `@modelcontextprotocol/sdk` Streamable HTTP at `POST /mcp` (stateless, JSON responses). Auth is Bearer API key only (write scope). Tools (`list_personas`, `get_persona`, `write`, `remember`) call the same Nest services as REST `/v1`. Rate limit covers `/mcp`.
- **Why:** One core for connect surfaces; MCP clients use keys, not cookies.

## D-010 · Governance: VibeOps + 정공법

- **Date:** 2026-08-23
- **Decision:** 모든 작업은 VibeOps `task add` / `ship` / `merge` / `sync`(/`release`)로 Git에 남기고, 아키텍처·상태·결정은 `docs/project/`와 TASK가 원본이다. 의사결정이 필요하면 임시 금지·하드코딩·강제 룰베이스 대신 TASK + `06-decisions` append(정공법)로 진행한다.
- **Why:** 채팅·암묵 규칙·엔진 분기보다 기록된 슬라이스와 결정 로그가 유지보수에 낫다. Cursor always-apply: `.cursor/rules/00-governance.mdc`.
