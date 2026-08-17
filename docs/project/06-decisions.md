# Decisions

> Append-only log. Add bullets when a TASK locks a choice — do not rewrite history.

## D-001 · VibeOps workflow

- **Date:** 2026-08-16T22:58:45.107Z
- **Decision:** TASK-driven development with `vibeops task add` / `task ship` / `merge` / `sync` and Cursor for plan/build. TASK status: **In Progress** → **Shipped** only.
- **Why:** Git `docs/tasks` beats chat as source of truth.

## D-002 · Persona platform

- **Date:** 2026-08-17
- **Decision:** 이 레포의 제품은 페르소나 등록·관리·성장과, 그 페르소나로 글을 쓰는 Agent API다.
- **Why:** 쓰기만 있으면 래퍼고, 등록만 있으면 주소록이다. 네 능력은 한 제품이다.

## D-003 · Kinds are writing, not the graph

- **Date:** 2026-08-17
- **Decision:** `post` / `comment` / `reply`는 글 종류다. 소셜 트리는 입력 맥락이다. 상황 케이스 표를 제품에 넣지 않는다.
- **Why:** 열린 장면을 열거할 수 없다. 종류는 형식 힌트이지 고정 경로가 아니다.

## D-004 · Persona is the original

- **Date:** 2026-08-17
- **Decision:** 페르소나 계약이 SoR이다. 글은 투영이다. 매 호출에 페르소나 전문을 보내지 않는다. API는 memory dump를 돌려주지 않는다.
- **Why:** 통째로 넣으면 느리고 새고 계정이 섞인다.

## D-005 · Gated growth

- **Date:** 2026-08-17
- **Decision:** 관찰은 `remember`로 후보가 된다. LTM은 `promote`만 만든다. 쓰기 경로가 정체성·보이스·경계를 직접 덮지 않는다.
- **Why:** 한 번의 피드백이 헌법을 바꾸면 다음 글이 무너진다.

## D-006 · Agent API, not a publisher

- **Date:** 2026-08-17
- **Decision:** 제품 표면은 Agent API다. 게시·브라우저·스케줄·피드 수집은 본체 밖(클라이언트)이다. `skip`은 성공이다.
- **Why:** 본체는 페르소나와 문장이다. 게시 채널은 바뀐다.

## D-007 · Split write and promote credentials

- **Date:** 2026-08-17
- **Decision:** 쓰기 토큰과 승격 토큰을 나눈다. 쓰기가 LTM을 쓰지 못한다.
- **Why:** 실수와 자동 루프가 기억을 오염시키지 못하게 한다.

## D-008 · Policy in the persona, not engine branches

- **Date:** 2026-08-17
- **Decision:** 계정·페르소나 차이는 계약에 산다. 엔진 코드에 계정 이름 분기를 넣지 않는다.
- **Why:** 새 페르소나가 코드 변경을 요구하면 플랫폼이 아니다.

## D-009 · Stack and engine reuse unlocked

- **Date:** 2026-08-17
- **Decision:** 언어, DB, HTTP 프레임워크, personaAgent 재사용 여부는 이 TASK에서 잠그지 않는다.
- **Why:** 기획이 잠글 것은 제품이다. 배선은 설계 TASK의 결정이다.
