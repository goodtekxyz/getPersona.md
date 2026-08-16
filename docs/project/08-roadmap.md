# Roadmap

> TASK-001이 잠근 후속 분해. 번호는 구현 순서가 아니라 기획 단위다. 실제 TASK id는 `vibeops task add`가 붙인다.

## After this TASK

기획은 여기까지다. 다음 설계 TASK가 스택과 모듈 경계를 잠근다.

## Suggested slices

| Slice | Locks | Not in this slice |
|-------|-------|-------------------|
| 설계 · 스택과 SoR | 언어, 런타임, DB, 모델 게이트웨이, 레포 모듈 경계. personaAgent 재사용 여부 | 테이블 DDL 구현 |
| 설계 · 계약 스키마 | identity / voice / boundary / permission 필드, WriteJob subjects | HTTP 서버 |
| 구현 · 페르소나 등록·관리 | Create / List / Get / Patch / Archive, 인증 | 쓰기 에이전트 |
| 구현 · 성장 | Remember / Promote / Project, 인덱스 | 오케스트레이션 |
| 구현 · Write Agent | post / comment / reply → text \| skip, 물리 법칙, trace | 게시 |
| 구현 · HTTP 표면 | 위 능력을 한 API로 노출, write/promote 토큰 | CLI / MCP |
| 품질 | 종류별 골드(정답 문장 없음), 누수·언어·길이 검사 | 라이브 소셜 |
| 표면 확장 | CLI, MCP. 같은 코어 | 새 정책 |

## Order hint

등록·관리가 쓰기보다 먼저다. `persona_id` 없이 WriteJob을 열지 않는다. 성장 파이프(`remember` → 후보 → `promote`)가 없는 쓰기는 학습하지 않는 래퍼이므로, Write와 같은 마일스톤에 넣거나 바로 앞에 둔다.

## Unlocked

- TypeScript / Postgres / Hono 등 구체 스택
- personaAgent 코드 재사용 vs 신규 코어
- 배포, CI, 관리 UI
- 비동기 Write, 레이트 리밋, 감사 로그
