# TASK-014: Cursor always-apply governance rule: VibeOps lifecycle + 정공법 decisions

## Status

Shipped

## Goal

Cursor가 항상 읽는 규칙에, VibeOps로 Git·아키텍처를 기록하고 의사결정은 정공법(TASK·문서)으로만 하며 하드코딩·금지·강제 룰베이스는 쓰지 않는다는 거버넌스를 고정한다.

## Scope

- `.cursor/rules/00-governance.mdc` 추가 (`alwaysApply: true`).
- `docs/project/06-decisions.md`에 D-010 append.

## Out of Scope

- `AGENTS.md` 전면 개편
- 다른 레포 전역 규칙
- 애플리케이션 코드 변경

## Acceptance Criteria

1. `00-governance.mdc`에 task add/ship/merge/sync, docs/project 원본, 정공법, 하지 않을 것이 있다.
2. D-010이 append-only로 추가된다.
3. Result / Test Result가 채워져 있다.

## Test Plan

- `.cursor/rules/00-governance.mdc` 존재 및 `alwaysApply: true`
- `06-decisions.md`에 D-010 존재
- 기존 `01`–`03` 규칙과 충돌 없음 (VibeOps 라이프사이클은 보완 관계)

## Git Context

- Base Branch: `develop`
- Base Commit: `2c9fbcd`
- Task Branch: `task/014-cursor-always-apply-governance-rule-vibeops-lifecycle-decisions`
- Started At: `2026-08-22T21:02:00.000Z`

## Result

- Added `.cursor/rules/00-governance.mdc` — VibeOps lifecycle, `docs/project` as SoR, 정공법 for decisions, no hardcoding/bans/forced rulebases.
- `docs/project/06-decisions.md` — D-010 Governance: VibeOps + 정공법.

## Test Result

- `00-governance.mdc`: `alwaysApply: true`, covers add/ship/merge/sync, 정공법, anti-patterns.
- D-010 present in `06-decisions.md`.
- No conflict with `01-task-source-of-truth`, `02-git-safety`, `03-docs-before-ship`.
