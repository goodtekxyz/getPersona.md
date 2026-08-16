# Architecture

> 구조나 주요 경로가 바뀌면 갱신한다.

## System

제품은 두 축이다. **페르소나 수명주기**와 **쓰기 Agent**. 둘은 한 코어를 공유한다.

```text
Operator / Client
        │
        ▼
   Agent API (HTTP)
        │
        ├─ register / get / patch     페르소나 계약
        ├─ remember / promote         성장
        └─ write (post|comment|reply) 작성
                │
                ▼
        ┌─────────────── Core ───────────────┐
        │  Persona SoR                       │
        │  Compile (좁은 계약)               │
        │  Retrieve (필요한 기억만)          │
        │  Write agent → text | skip         │
        └────────────────────────────────────┘
```

런타임은 아직 없다. 이 그림은 기획이 잠근 논리 구조다. 스택(언어, DB, 프레임워크)은 설계 TASK에서 정한다.

## Layers

| Layer | What | LLM? |
|-------|------|------|
| Contract | 등록·관리된 페르소나. 정체성, 보이스, 경계, 권한 | No |
| Memory | 에피소드, 후보, LTM. `remember` / `promote`만 쓴다 | No (쓰기). 판단은 에이전트 |
| Compile / project | 이번 일에 필요한 계약 투영 | No |
| Write agent | 글 종류를 힌트로 초안을 만들고 판정한다 | Yes |
| Physical laws | 길이, 누수, 세션 분리, judge 재작성 금지 | No |

정책은 계약에 산다. 엔진 코드에 계정 이름을 넣지 않는다.

## Persona object

최소 계약. 구현 테이블이 아니다.

| Part | Role | 아닌 것 |
|------|------|---------|
| Identity | 누구인지, 무엇을 위해 쓰는지 | 외모·가족·일기 |
| Voice | 손이 어떻게 움직이는지, 입장, 산 문장 소수 | 코퍼스 dump |
| Boundaries | 하지 않을 말, 공개 범위 | 프롬프트 잔소리 |
| Permissions | 자동화·내보내기·가시성 | 엔진 권한 분기 |
| Memory | 사실, 결정, 관계, 경험 | 계약과 한 덩어리인 프롬프트 |

글은 이 객체의 투영이다. API는 페르소나 전체를 돌려주지 않는다.

## Write path

```text
WriteJob { persona_id, kind, channel, language, source, constraints }
        │
        ▼
   project()     좁은 계약 + 이번 기억 창
        │
        ▼
   write agent   초안 → 판정 → 재시도 또는 skip
        │
        ▼
   { status: text | skip, text?, reason?, run_id, memory_used }
```

- `skip`은 실패가 아니다. 이 페르소나가 여기서 할 말이 없다는 성공이다.
- 공개 문장은 판정을 통과해야 한다. 판정 에이전트는 문장을 고쳐 쓰지 않는다.
- 쓰기 경로가 LTM을 직접 승격하지 않는다. 후보는 `promote`만 승격한다.

## Isolation

- 한 역할이 쓰고 판정하고 고치지 않는다.
- 에이전트는 잡을 공유하고 채팅을 공유하지 않는다.
- 관계 카드는 이번 상대만 연다. CRM dump 금지.

## Key paths (today)

| Area | Path |
|------|------|
| Purpose | `docs/project/01-purpose.md` |
| Product | `docs/project/02-product.md` |
| Architecture | `docs/project/03-architecture.md` |
| Agent API | `docs/project/04-api.md` |
| Growth | `docs/project/07-growth.md` |
| Roadmap | `docs/project/08-roadmap.md` |
| TASK docs | `docs/tasks/` |
| VibeOps config | `.vibeops.json` |
| Application | (none) |

## Process (VibeOps)

작업 단위는 채팅이 아니라 Git의 TASK 파일이다.

```
vibeops task add
        ↓
docs/tasks/TASK-NNN-*.md   (In Progress)
        ↓
Cursor plan / implement
        ↓
vibeops task ship          (PR → Status: Shipped)
        ↓
vibeops task merge         (develop)
        ↓
vibeops task sync / release   (optional)
```

## Adjacent (observed)

`personaAgent`는 카드 SoR와 WriteJob HTTP를 이미 돌린다. 이 기획은 그 엔진을 흡수하거나 폐기하지 않는다. 코어를 재사용할지, 이 레포에 새로 둘지는 설계 TASK의 결정이다.

## Non-goals in this architecture

- 게시·브라우저·스케줄을 코어에 넣는 것
- 마크다운 패키지를 런타임 원본으로 두는 것
- 벡터 DB를 페르소나 원본으로 두는 것
- 상황 케이스 표, 계정 하드코딩
