# Current state

> Facts only. Updated by `vibeops task ship` / humans after merge (not by `task sync`).

## Stage

- VibeOps 2.5.2로 부트스트랩됨 (`d2010c9`, 2026-08-16).
- TASK-001이 제품 기획을 `docs/project/01`–`08`에 고정하는 중이다. 애플리케이션 코드는 없다.

## Product (planned)

페르소나 등록·관리·성장 + Agent API (`post` / `comment` / `reply` → `text` \| `skip`). 게시는 본체 밖.

## VibeOps

| Item | Value |
|------|-------|
| CLI / config | `vibeops` 2.5.2 · `.vibeops.json` |
| Agent client | Cursor (`.cursor/rules`, `.cursor/skills`) |
| Git host | GitHub `goodtekxyz/getPersona.md` (private) |
| Integration branch | `develop` |
| Production branch | `main` |
| LLM | `auto` (status: Codex OAuth) |
| Lifecycle | `vibeops task add` → plan/build → `task ship` → `task merge` → optional `task sync` / `task release` |
| TASK status | **In Progress** → **Shipped** only |

실행 규칙은 `AGENTS.md`와 D-001이 원본이다. 에이전트는 `task merge` / `task sync`를 사람이 요청하기 전에 돌리지 않는다.

## Active TASK

- `TASK-001` · 페르소나 프로젝트 기획 · branch `task/001-task` · In Progress

## Built

| Area | State |
|------|-------|
| Project docs | `docs/project/01`–`08` 기획 초안 (이 TASK) |
| Application | 없음 |
| Tests / deploy | 없음 |

## Next step

TASK-001을 ship한 뒤, 스택·SoR·personaAgent 재사용을 잠그는 설계 TASK.

## Inventory

| Path | Role |
|------|------|
| `.vibeops.json` | 프로젝트·브랜치·클라이언트 설정 |
| `AGENTS.md` | 에이전트용 TASK 워크플로 |
| `docs/project/` | 기획 원본 |
| `docs/tasks/` | TASK 원본 |
| `docs/logs/` | 일자별 작업 로그 |
