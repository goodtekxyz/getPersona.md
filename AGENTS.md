# Project — AI Agent Guide

> Installed by VibeOps. Read before coding.

## Repo management (hard rules)

이 레포의 TASK·브랜치·PR·머지·릴리즈 라이프사이클은 **VibeOps만**으로 관리한다. 에이전트와 사람은 아래 명령을 **직접 `vibeops`로** 실행한다.

| Step | Command | When |
|------|---------|------|
| 1 | `vibeops task add` | 새 TASK / 브랜치 시작 |
| 2 | plan / build (agent) | `docs/tasks/TASK-NNN-*.md` 기준 구현 |
| 3 | `vibeops task ship` | PR 생성·갱신 (반영 제출) |
| 4 | `vibeops task merge` | integration(`develop`) 머지 |
| 5 | `vibeops task sync` | (선택) 브랜치 정리 |
| 6 | `vibeops task release` | (선택) production(`main`) 릴리즈 |

**단계를 어기고 반영하지 않는다.**

- `add` 없이 TASK·`task/*` 브랜치를 만들지 않는다.
- `ship` 없이 PR을 만들거나 머지·릴리즈로 넘기지 않는다.
- `merge` 없이 `develop`/`main`에 직접 합치지 않는다.
- `merge` 전에 `release`하지 않는다.
- IDE 로컬 merge, `gh pr merge`, 수동 PR 생성 등으로 VibeOps 단계를 **대체하지 않는다**.
- `ship` / `merge` / `sync` / `release`는 사람이 요청했을 때만 실행한다. 실행할 때도 반드시 `vibeops`를 쓴다.

## TASK workflow

```bash
vibeops task add
# Plan / build in your agent (@docs/tasks/TASK-NNN-*.md)

vibeops task ship           # state-aware: new PR / update open PR / new cycle
vibeops task merge          # CLI or host UI
vibeops task sync           # optional — branch cleanup only

# Same TASK, before merge — just re-run ship to update the open PR:
vibeops task ship -m "address review"
# Same TASK, after merge — start a new PR cycle:
vibeops task ship --new-cycle
vibeops task merge
```

Optional release to production: `vibeops task release`.

## TASK status (markdown)

Only two values in `## Status`:

| Status | Meaning |
|--------|---------|
| **In Progress** | Active slice (`task add`) |
| **Shipped** | Submitted (`task ship`) |

Merge and sync do **not** change the TASK file.

```bash
vibeops llm connect   # optional — task add / ship
```

## Rules

- One **In Progress** TASK at a time; **Shipped** does not block `task add`.
- Fill **Result** and **Test Result** before `vibeops task ship` (warned, not blocked, when updating an open PR).
- `ship` is state-aware: re-run it to update an open PR; after merge it needs `--new-cycle` (or a confirm) to start a new PR cycle.
- Lifecycle ops (`add` / `ship` / `merge` / `sync` / `release`) go through `vibeops` only; do not skip or bypass stages.
- Agents run `task ship` / `merge` / `sync` / `release` only when the human asks — always via `vibeops`.
