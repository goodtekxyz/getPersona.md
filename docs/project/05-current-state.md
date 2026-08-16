# Current state

> Facts only. Updated by `vibeops task ship` / humans after merge (not by `task sync`).

## Stage

- VibeOps 2.5.2로 부트스트랩됨 (`d2010c9`, 2026-08-16).
- 애플리케이션 코드·패키지 매니페스트·테스트·배포 설정은 없음.
- 워크플로는 VibeOps TASK 사이클만 사용한다.

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

## Inventory

| Path | Role |
|------|------|
| `.vibeops.json` | 프로젝트·브랜치·클라이언트 설정 |
| `.vibeops.env.example` | 선택 LLM 키 템플릿 (`.vibeops.env`는 gitignore) |
| `AGENTS.md` | 에이전트용 TASK 워크플로 |
| `.cursor/rules/` | TASK 원본, git 안전, ship 전 문서 |
| `.cursor/skills/` | `plan-task`, `implement-task` |
| `docs/tasks/` | TASK 원본 (`TASK-000` 템플릿, `TASK-001` 진행 중) |
| `docs/project/` | 프로젝트 메모리 (architecture, current-state, decisions) |
| `docs/logs/` | 일자별 작업 로그 |

## Next step

TASK-001에서 페르소나 프로젝트 목적·범위·MVP를 문서에 고정한다.
