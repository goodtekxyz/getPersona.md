# TASK-002: 설계 — 제품 표면·기술 스택·호스트 고정

## Status

In Progress

## Goal

제품 표면(웹·에이전트·API/MCP)과 기술 스택·호스트를 **버전까지** 문서에 고정해, 이후 구현 TASK가 배선 결정을 다시 하지 않게 한다.

## Scope

- Q&A로 잠근 제품 표면·스택·호스트·운영 결정을 `docs/project/`와 결정 로그에 반영한다.
- `personaAgent`의 post/comment/reply를 `getPersona.md` 모노레포 `apps/api` 에이전트 모듈로 **흡수**한다고 고정한다 (코드 이전은 후속 구현 TASK).
- `getDesign.md`는 **다른 서비스**이며 디자인·레이아웃·가입 UX 등의 **벤치마크**만 한다. 구현은 전부 이 레포.
- D-009를 닫는 후속 결정(D-010+)을 `06-decisions.md`에 **추가만** 한다.

## Out of Scope

- 애플리케이션 코드, DDL, 실제 Nest/Next 스캐폴드
- personaAgent 코드 이동 구현
- 플랫폼 어댑터(블로그/X/Threads) 구현
- `admin.getpersona.md`, 결제, feature flag, OpenTelemetry
- `vibeops task ship` / `merge` / `sync` (사람이 요청할 때)

## Acceptance Criteria

1. 제품 표면이 문서에 있다: 랜딩·가입·로그인 · 페르소나 등록·싱크·포크 · agent · API/MCP · 키/퍼블릭.
2. 호스트가 고정된다: `getpersona.md` / `agent.getpersona.md` / `api.getpersona.md` (내부 단일 `apps/api`).
3. 스택이 버전까지 표로 고정된다 (Node 24, Next 16.3, Nest 11.2, PG 17, TypeORM, Better Auth, 등).
4. `personaAgent` → `getPersona.md/agent`(역할별 에이전트) 흡수가 명시된다.
5. `getDesign.md`는 벤치마크만임이 명시된다.
6. 후속(어댑터·admin·결제·OTel·feature flag)이 Out of product / 후속으로 구분된다.
7. 새 결정은 `06-decisions.md`에 append-only로 들어간다.

## Test Plan

- `docs/project/README.md` 표와 실제 파일 일치.
- `09-stack.md`(또는 동등)와 `02`/`03`/`05`/`06`/`08`에서 위 AC가 빠지지 않았는지 읽기.
- D-009와 충돌하지 않고 D-010+로 닫혔는지 확인.
- `vibeops status`가 TASK-002 In Progress를 가리키는지 확인.

## Git Context

- Base Branch: `develop`
- Base Commit: `cb2bd05`
- Task Branch: `task/002-next-nest-pg17-personaagent-agent`
- Started At: `2026-08-17T01:25:38.568Z`

## Result

제품 표면·스택·호스트를 `docs/project/`에 고정했다. 애플리케이션 코드는 없다.

작성·갱신:

- `docs/project/09-stack.md` (신규)
- `docs/project/README.md`, `01-purpose.md`, `02-product.md`, `03-architecture.md`, `05-current-state.md`, `06-decisions.md` (D-010–D-014), `08-roadmap.md`
- `docs/tasks/TASK-002-next-nest-pg17-personaagent-agent.md`
- `docs/logs/2026-08-17.md`

## Test Result

수동 리뷰 (2026-08-17):

- README에 `09-stack.md` 포함, 파일 존재.
- 표면·호스트·소속·키/퍼블릭이 `01`/`02`/`09`에 있다.
- 스택 버전 표가 `09`에 있다. D-012와 일치.
- personaAgent 흡수·getDesign 벤치마크만: `01`/`09`/D-010·D-013.
- D-009는 유지(역사). D-010+로 닫힘.
- `vibeops status` → TASK-002 In Progress.
