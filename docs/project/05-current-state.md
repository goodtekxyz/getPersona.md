# Current state

> Facts only. Updated by `vibeops task ship` / humans after merge (not by `task sync`).

## Stage

- VibeOps 2.5.2. TASK-001(기획) **Shipped·merged** to `develop`.
- TASK-002(스택·제품 표면 설계) **In Progress** on `task/002-next-nest-pg17-personaagent-agent`.
- 애플리케이션 코드·스캐폴드 없음.

## Product (planned)

웹(랜딩·가입·로그인·등록·싱크·포크) + agent(post/comment/reply) + API/MCP.  
호스트: `getpersona.md` / `agent.getpersona.md` / `api.getpersona.md`.  
스택: [09-stack.md](09-stack.md).

## VibeOps

| Item | Value |
|------|-------|
| CLI / config | `vibeops` 2.5.2 · `.vibeops.json` |
| Agent client | Cursor |
| Git host | GitHub `goodtekxyz/getPersona.md` (private) |
| Integration | `develop` |
| Production | `main` |
| Lifecycle | add → ship → merge → sync → release (`AGENTS.md` hard rules) |

## Active TASK

- `TASK-002` · 제품 표면·스택·호스트 고정 · In Progress

## Built

| Area | State |
|------|-------|
| Project docs | `01`–`09` (002가 스택·표면 갱신 중) |
| Application | 없음 |
| Tests / deploy | 없음 |

## Next step

TASK-002 문서 확정 후 ship → merge. 다음 구현: 모노레포 스캐폴드 (Next+Nest+PG17).

## Inventory

| Path | Role |
|------|------|
| `.vibeops.json` | 프로젝트 설정 |
| `AGENTS.md` | VibeOps hard rules |
| `docs/project/` | 기획·설계 원본 |
| `docs/tasks/` | TASK 원본 |
| `docs/logs/` | 일자 로그 |
