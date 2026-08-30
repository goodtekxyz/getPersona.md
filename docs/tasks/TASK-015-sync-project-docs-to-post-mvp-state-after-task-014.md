# TASK-015: Sync project docs to post-MVP state after TASK-014

## Status

Shipped

## Goal

`05-current-state` / `08-roadmap`를 vibeops 실제 상태(TASK-001–014 Shipped, P1 Done)에 맞추고, 이 제품이 **연결하는 범위**를 current-state에 사실로 적는다.

## Scope

- `docs/project/05-current-state.md` — MVP/P1/거버넌스 Done, Connect surface 표, next step
- `docs/project/08-roadmap.md` — P1/TASK-014 Done, TASK-015 in progress
- 이 TASK Result / Test Result 채움

## Out of Scope

- 애플리케이션 코드
- `vibeops task release`
- P2 구현

## Acceptance Criteria

1. Active TASK가 TASK-015이고 TASK-013 In Progress가 아니다.
2. P1·TASK-014가 Done/Shipped로 표시된다.
3. Connect surface 표에 REST/MCP/llm_wrapper/sync stub/adjacent가 있다.
4. Result / Test Result가 채워져 있다.

## Test Plan

- `vibeops status`와 `05-current-state` Active TASK가 일치
- `08-roadmap` P1 = Done, TASK-014 = Done
- Connect 표가 `01-purpose` / `04-api` / `09-stack`과 충돌하지 않음

## Git Context

- Base Branch: `develop`
- Base Commit: `6791aaf`
- Task Branch: `task/015-sync-project-docs-to-post-mvp-state-after-task-014`
- Started At: `2026-08-30T10:15:26.524Z`

## Result

- Updated `05-current-state.md`: TASK-001–014 done facts; Connect surface table; TASK-015 active.
- Updated `08-roadmap.md`: P1 Done, TASK-014 Done, TASK-015 In Progress.

## Test Result

- Docs no longer claim TASK-013 In Progress.
- Connect table: web/agent/api hosts; clients MCP/API key; llm_wrapper; sync stub; personaLoop adjacent; prod not built — matches `01`/`04`/`09`.
