# TASK-001: 페르소나 프로젝트 기획

## Status

In Progress

## Goal

페르소나 등록·관리·성장과 Agent API(포스팅·댓글·대댓글 → 문장 또는 skip)를 제품으로 고정해, 설계·구현 TASK로 이어질 수 있게 한다.

## Scope

- 목적, 문제, 제품 경계, 인접 시스템을 `docs/project/`에 적는다.
- 사용자, 글 종류, 시나리오, MVP, Out of product를 고정한다.
- 논리 아키텍처(수명주기 + 쓰기 경로)와 Agent API 능력을 고정한다.
- 등록·관리·성장·retrieve 규칙을 고정한다.
- 후속 설계/구현 단위를 로드맵으로 분해한다.
- VibeOps 워크플로 기록(D-001, current-state)을 유지한다.

## Out of Scope

- 애플리케이션 코드, 스키마 DDL, HTTP 서버
- 스택 최종 확정, personaAgent 재사용 확정
- 상세 UI, 배포, 인프라
- personaAgent / personaLoop / llm_wrapper 코드 변경
- `vibeops task ship` / `merge` / `sync` (사람이 실행)

## Acceptance Criteria

1. 제품 한 줄이 등록·관리·성장·Agent API를 포함한다.
2. 글 종류 `post` / `comment` / `reply`와 skip이 문서에 있다.
3. 핵심 사용자(Operator, Client)와 시나리오가 있다.
4. MVP와 Out of product가 있다.
5. Agent API 능력(페르소나 CRUD, remember/promote/project, write, health)이 있다.
6. 성장이 후보·게이트이지 자동 승격이 아님이 명시되어 있다.
7. 후속 TASK로 쪼갤 수 있는 로드맵이 있다.
8. D-001과 충돌하지 않는다. 새 결정은 `06-decisions.md`에 추가만 한다.

## Test Plan

- `docs/project/README.md`의 표와 실제 파일이 일치하는지 확인한다.
- `01`–`04`, `07`–`08`에서 목표·사용자·시나리오·MVP·API·성장·로드맵이 빠지지 않았는지 읽는다.
- 금지 항목이 있는지 확인한다: 게시 본체, 챗봇, dump, 계정 하드코딩, 자동 정체성 승격, 케이스 표.
- `vibeops status`가 TASK-001 In Progress, `task/001-task`를 가리키는지 확인한다.

## Git Context

- Base Branch: `develop`
- Base Commit: `d2010c9`
- Task Branch: `task/001-task`
- Started At: `2026-08-16T23:00:34.451Z`

## Result

기획 초안을 `docs/project/`에 반영했다. 애플리케이션 코드는 없다.

작성·갱신한 경로:

- `docs/project/README.md`
- `docs/project/01-purpose.md`
- `docs/project/02-product.md`
- `docs/project/03-architecture.md`
- `docs/project/04-api.md`
- `docs/project/05-current-state.md`
- `docs/project/06-decisions.md` (D-002–D-009)
- `docs/project/07-growth.md`
- `docs/project/08-roadmap.md`
- `docs/tasks/TASK-001-task.md`
- `docs/logs/2026-08-17.md`

잠근 한 줄: 페르소나가 원본이다. 글은 투영이다. API는 문장 또는 skip을 돌려준다. 게시는 본체가 아니다.

## Test Result

수동 리뷰 (2026-08-17):

- README 표의 8개 문서가 모두 있다.
- 목표·사용자 2종·시나리오 6·MVP·Out of product가 `01`/`02`에 있다.
- 글 종류와 skip이 `02`/`04`에 있다. 케이스 표 금지.
- API 능력과 write/promote 토큰 분리가 `04`에 있다.
- 성장 게이트가 `07`과 D-005에 있다.
- 로드맵이 `08`에 있다. 스택·재사용은 D-009로 열어 두었다.
- D-001과 VibeOps current-state가 유지된다.
