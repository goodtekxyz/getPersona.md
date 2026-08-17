# Roadmap

> 실제 TASK id는 `vibeops task add`가 붙인다. 상세 마일스톤은 [10-dev-plan.md](10-dev-plan.md).

## Done / in flight

| Slice | Status |
|-------|--------|
| 기획 · 제품·성장·Agent API | TASK-001 **Shipped** |
| 설계 · 스택·호스트·제품 표면 | TASK-002 **Shipped** |
| 개발계획 · M0–M8 마일스톤 | TASK-003 **In Progress** |

## Implementation order (from plan)

| # | Milestone | Suggested TASK |
|---|-----------|----------------|
| M0 | DESIGN/LAYOUT/UX 잠금 + 모노레포 스캐폴드 | 구현: design lock + Next/Nest scaffold |
| M1 | Better Auth 계정 | 구현: 가입·로그인 |
| M2 | 페르소나 SoR + fork | 구현: 등록·관리·포크 |
| M3 | Growth | 구현: remember/promote/project |
| M4 | Agents | 구현: post/comment/reply 흡수 |
| M5 | Connect | 구현: `/v1` + keys + Swagger |
| M6 | MCP | 구현: MCP on api |
| M7 | Sync boundary | 구현: BullMQ 싱크 잡 + stub adapter |
| M8 | Quality | 구현: 골드·누수·harden |

## Deferred

admin 호스트 · 결제 · feature flags · OTel · 실 플랫폼 스크레이프  
(UI: M0에서 DESIGN/LAYOUT/UX 잠금)
