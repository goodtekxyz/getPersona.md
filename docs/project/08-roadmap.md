# Roadmap

> 번호는 구현 순서가 아니다. 실제 TASK id는 `vibeops task add`가 붙인다.

## Done / in flight

| Slice | Status |
|-------|--------|
| 기획 · 제품·성장·Agent API | TASK-001 Shipped |
| 설계 · 스택·호스트·제품 표면 | TASK-002 In Progress |

## Suggested next slices

| Slice | Locks | Not in this slice |
|-------|-------|-------------------|
| 구현 · 모노레포 스캐폴드 | pnpm/turbo, apps/web+api, compose, CI skeleton | 비즈니스 로직 |
| 구현 · 계정 (Better Auth) | 가입·로그인·쿠키 `.getpersona.md` | 페르소나 싱크 |
| 구현 · 페르소나 등록·관리 | CRUD/archive, 소속 검사 | 쓰기 에이전트 |
| 구현 · 성장 | remember/promote/project | 오케스트레이션 |
| 구현 · Agent 흡수 | post/comment/reply from personaAgent | 게시 어댑터 |
| 구현 · HTTP `/v1` + 키 + Swagger | 연결 면 | MCP |
| 구현 · MCP | SDK on same api | 새 정책 |
| 구현 · 싱크 잡 + 어댑터 경계 | BullMQ job shape | 실제 X/Threads 스크레이프 |
| 품질 | 종류별 골드, 누수·길이 | 라이브 소셜 |
| 후속 | admin 호스트, 결제, OTel, getDesign 시각 정렬 | — |

## Order hint

스캐폴드 → 계정 → 페르소나 SoR → 성장 → agent → `/v1` → MCP.  
싱크 어댑터는 SoR·큐 이후. `persona_id` 없이 WriteJob을 열지 않는다.
