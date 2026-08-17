# Architecture

> 구조나 주요 경로가 바뀌면 갱신한다. 스택 버전은 [09-stack.md](09-stack.md).

## System

```text
Browser / Client / MCP
        │
        ├─ getpersona.md          → apps/web (Next.js)
        ├─ agent.getpersona.md    ┐
        └─ api.getpersona.md      ┴→ apps/api (NestJS, one process)
                │
                ├─ Auth (Better Auth, cookie .getpersona.md)
                ├─ Persona SoR (TypeORM / Postgres)
                ├─ Growth: remember / promote / project
                ├─ Agents: post | comment | reply  (from personaAgent)
                ├─ Queue: BullMQ / Redis (sync & long jobs)
                └─ LLM: llm_wrapper only
```

## Layers

| Layer             | What                                     | LLM?                       |
| ----------------- | ---------------------------------------- | -------------------------- |
| Web               | 랜딩·계정·페르소나 UI                    | No                         |
| Contract          | 등록·관리된 페르소나                     | No                         |
| Memory            | 에피소드·후보·LTM                        | No (쓰기). 판단은 에이전트 |
| Compile / project | 이번 일용 좁은 계약                      | No                         |
| Write agents      | kind별 초안·판정 → text \| skip          | Yes                        |
| Physical laws     | 길이, 누수, 세션 분리, judge 재작성 금지 | No                         |

## Write path

```text
WriteJob { persona_id, kind, channel, language, source, constraints }
        → project() → write agent → { status: text|skip, run_id, memory_used }
```

- `skip`은 성공일 수 있다.
- 쓰기 경로가 LTM을 직접 승격하지 않는다.
- 계정 소속 검사 후 작업.

## Key paths (today)

| Area          | Path                                                  |
| ------------- | ----------------------------------------------------- |
| Stack / hosts | `docs/project/09-stack.md`                            |
| Product       | `docs/project/02-product.md`                          |
| Agent API     | `docs/project/04-api.md`                              |
| Write         | `POST /v1/write` (`apps/api/src/write`)               |
| Sync          | `POST /v1/sync` + `GET /v1/sync/:jobId` (BullMQ/stub) |
| MCP           | `POST /mcp` (`apps/api/src/mcp`) — same Nest services |
| TASK          | `docs/tasks/`                                         |
| Application   | `apps/web`, `apps/api`, `packages/shared`             |

## Process (VibeOps)

`vibeops task add` → plan/build → `task ship` → `task merge` → optional `sync` / `release`.  
단계는 `AGENTS.md` hard rules. 대체 경로로 반영하지 않는다.

## Non-goals in this architecture

- agent와 api를 **별도 배포**로 쪼개어 HTTP로 다시 붙이는 것 (초기)
- 마크다운 패키지·벡터 DB를 페르소나 원본으로 두는 것
- 엔진 코드의 계정 하드코딩·상황 케이스 표
