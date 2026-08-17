# Roadmap

> 실제 TASK id는 `vibeops task add`가 붙인다. 상세 마일스톤은 [10-dev-plan.md](10-dev-plan.md).

## Done / in flight

| Slice                        | Status                   |
| ---------------------------- | ------------------------ |
| 기획 · 제품·성장·Agent API   | TASK-001 **Shipped**     |
| 설계 · 스택·호스트·제품 표면 | TASK-002 **Shipped**     |
| 개발계획 · M0–M8 마일스톤    | TASK-003 **Shipped**     |
| M0 · design lock + scaffold  | TASK-004 **Shipped**     |
| M1 · Better Auth             | TASK-005 **Shipped**     |
| M2 · Persona SoR + fork      | TASK-006 **Shipped**     |
| M3 · Growth                  | TASK-007 **Shipped**     |
| M4 · Write agents            | TASK-008 **Shipped**     |
| M5 · Connect `/v1` + keys    | TASK-009 **Shipped**     |
| M6 · MCP                     | TASK-010 **Shipped**     |
| M7 · Sync job boundary       | TASK-011 **Shipped**     |
| M8 · Quality & harden        | TASK-012 **In Progress** |

## Implementation order (from plan)

| #   | Milestone                                 | Status    | TASK     |
| --- | ----------------------------------------- | --------- | -------- |
| M0  | DESIGN/LAYOUT/UX 잠금 + 모노레포 스캐폴드 | **Done**  | TASK-004 |
| M1  | Better Auth 계정                          | **Done**  | TASK-005 |
| M2  | 페르소나 SoR + fork                       | **Done**  | TASK-006 |
| M3  | Growth                                    | **Done**  | TASK-007 |
| M4  | Agents                                    | **Done**  | TASK-008 |
| M5  | Connect                                   | **Done**  | TASK-009 |
| M6  | MCP                                       | **Done**  | TASK-010 |
| M7  | Sync boundary                             | **Done**  | TASK-011 |
| M8  | Quality                                   | **Done*** | TASK-012 |

\*Implemented on `task/012-…`; status becomes Shipped after `vibeops task ship` / merge.

## Deferred

admin 호스트 · 결제 · feature flags · OTel · 실 플랫폼 스크레이프  
(UI: M0에서 DESIGN/LAYOUT/UX 잠금)
