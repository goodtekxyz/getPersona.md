# Architecture

> Living overview. Update when structure or major paths change (often via `vibeops task ship`).

## System

`getPersona.md`는 아직 런타임이 없다. 현재 레포는 VibeOps 거버넌스 골격만 있다.

작업 단위는 채팅이 아니라 Git의 TASK 파일이다. Cursor가 plan/build를 하고, CLI가 PR 수명주기를 담당한다.

```
vibeops task add
        ↓
docs/tasks/TASK-NNN-*.md   (In Progress)
        ↓
Cursor plan / implement
        ↓
vibeops task ship          (PR open or update → Status: Shipped)
        ↓
vibeops task merge         (develop)
        ↓
vibeops task sync          (optional branch cleanup)
        ↓
vibeops task release       (optional → main)
```

## Key paths

| Area | Path |
|------|------|
| VibeOps config | `.vibeops.json` |
| Agent guide | `AGENTS.md` |
| Cursor rules / skills | `.cursor/rules/`, `.cursor/skills/` |
| TASK docs | `docs/tasks/` |
| Project memory | `docs/project/` |
| Daily logs | `docs/logs/` |
| Application | (none) |

## Adjacent (observed, not owned)

같은 워크스페이스에 `personaAgent`가 있다. 그 엔진은 getPersona 패키지 디렉터리를 한 번 import한 뒤 Postgres 카드를 SoR로 쓴다. 이 레포에는 아직 패키지 디렉터리나 import 계약이 없다.
