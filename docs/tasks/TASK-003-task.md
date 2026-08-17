# TASK-003: 개발계획 — 전체 구현 마일스톤

## Status

In Progress

## Goal

TASK-001·002가 잠근 제품·스택을 기준으로, MVP까지의 **전체 개발계획**(마일스톤·의존·완료 조건·후속 TASK 분해)을 문서에 고정한다.

## Scope

- `docs/project/10-dev-plan.md`에 M0–M8 마일스톤, 의존 그래프, MVP 완료 조건, 리스크, 제안 TASK 순서를 적는다.
- M0에 **getDesign.md 벤치 → DESIGN.md / LAYOUT.md / UX.md 잠금(M0a)** 을 포함한다.
- `08-roadmap.md`·`05-current-state.md`·`README.md`·관련 제품/스택 문구를 계획과 맞게 갱신한다.
- 구현 코드·스캐폴드·세 디자인 파일 본문 작성은 하지 않는다 (M0 구현 TASK).

## Out of Scope

- 애플리케이션 코드, DDL, CI 워크플로 파일 생성
- `DESIGN.md` / `LAYOUT.md` / `UX.md` 본문 작성 (스캐폴드 TASK)
- 개별 구현 TASK의 상세 AC (각 `task add` 때 작성)
- admin / 결제 / OTel / 실 스크레이프 설계 확정
- `vibeops task ship` / `merge` / `sync` (사람 요청 시)

## Acceptance Criteria

1. M0–M8과 의존 순서가 `10-dev-plan.md`에 있다.
2. M0a가 getDesign.md 확인 후 DESIGN/LAYOUT/UX 잠금을 요구한다.
3. MVP 완료 조건(체크리스트)이 있다.
4. 각 마일스톤에 Goal / Deliverable / Exit / Out / Depends가 있다.
5. Deferred와 리스크가 있다.
6. 제안 구현 TASK 순서가 있다.
7. README·roadmap·current-state가 계획을 가리킨다.

## Test Plan

- README 표에 `10-dev-plan.md`와 DESIGN/LAYOUT/UX(예정) 안내가 있다.
- `10-dev-plan.md` M0에 M0a(design lock) + M0b(scaffold)가 있다.
- M0→M7 순서가 스캐폴드→계정→SoR→성장→agent→/v1→MCP→싱크와 일치한다.
- MVP 체크리스트가 `02`/`09` 잠금과 모순되지 않는다.
- `vibeops status`가 TASK-003 In Progress를 가리킨다.

## Git Context

- Base Branch: `develop`
- Base Commit: `712c03b`
- Task Branch: `task/003-task`
- Started At: `2026-08-17T01:30:41.534Z`

## Result

전체 구현 계획을 `docs/project/10-dev-plan.md`에 고정했다. 코드 없음.

작성·갱신:

- `docs/project/10-dev-plan.md` — M0–M8, **M0a DESIGN/LAYOUT/UX 잠금**, MVP 조건, 리스크, 제안 TASK 순서
- `docs/project/README.md`, `01-purpose.md`, `02-product.md`, `05-current-state.md`, `08-roadmap.md`, `09-stack.md`
- `docs/tasks/TASK-003-task.md`
- `docs/logs/2026-08-17.md`

## Test Result

수동 리뷰 (2026-08-17):

- README에 `10-dev-plan.md` 및 DESIGN/LAYOUT/UX(M0a 예정) 안내.
- M0 = M0a(getDesign.md → DESIGN/LAYOUT/UX) + M0b(scaffold).
- M0→M7 순서·MVP 체크리스트·llm_wrapper·소속·키 해시 모순 없음.
- Deferred·리스크·제안 TASK 순서 있음.
- `vibeops status` → TASK-003 In Progress.
