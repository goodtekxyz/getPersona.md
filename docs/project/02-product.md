# Product

> 사용자, 표면, 글 종류, 시나리오, MVP. 구현이 아님.

## Surfaces

| Surface | Host | Does |
|---------|------|------|
| Web | `getpersona.md` | 랜딩, 가입, 로그인, 페르소나 등록·싱크·포크·관리 UI. UX는 **getDesign.md 벤치마크** |
| Agent | `agent.getpersona.md` | post / comment / reply 등 **역할 에이전트 모임** |
| Connect | `api.getpersona.md` | REST `/v1` + MCP. 키 또는 명시적 퍼블릭 |

내부는 모노레포. `agent`와 `api`는 같은 Nest 앱을 가리킨다.

## Capabilities

| Capability | Does | Success looks like |
|------------|------|--------------------|
| **계정** | 가입·로그인 (getDesign.md와 동일 패턴: 약관·메일·OAuth) | 계정에 페르소나가 소속된다 |
| **등록** | 페르소나 최소 계약 생성 | `persona_id` 이후 호출에 사용 |
| **싱크** | 특정 사람/채널(블로그·X·Threads 핸들 등)에 맞춰 정체성·말투를 학습·반영 | 계약이 그 소스에 더 가깝다. 어댑터 구현은 후속 |
| **포크** | 공개 영역을 가져와 새 페르소나/사본 | 공개 범위만 복사 |
| **관리** | 계약 조회·부분 수정·보관 | 엔진 코드 없이 보이스·금지 변경 |
| **성장** | remember → 후보 → promote | 다음 retrieve가 정확해진다 |
| **작성** | 소속 페르소나로 post/comment/reply → text \| skip | 그 사람 말투, 또는 legit skip |
| **연결** | API 키(해시 저장) · MCP · (명시) 퍼블릭 | 키/세션 없이 열린 것만 퍼블릭 |

쓰기만 있고 등록·성장이 없으면 래퍼다. 등록만 있고 쓰기가 없으면 주소록이다. 웹만 있고 agent가 없으면 운영 툴이다.

## Content kinds

| Kind | Job | 다른 종류로 쓰면 |
|------|-----|------------------|
| `post` | 한 각도의 공개 발화 | 반응문이나 요약이 된다 |
| `comment` | 보이는 원문에 대한 반응 | 설명·조언·작성자 맺음말이 된다 |
| `reply` | 특정 댓글 아래의 관계 이동 | 짧은 댓글이나 빈 감사가 된다 |

원글 → 댓글 → 대댓글 트리는 **입력 맥락**이다. 상황 케이스 표를 제품에 넣지 않는다.

## Users

- **Account holder**: 가입 후 자기 페르소나를 등록·싱크·포크·관리한다.
- **Operator**: 후보·게이트(promote)를 승인한다 (동일 계정 또는 역할).
- **Client**: API 키 또는 MCP로 agent/연결 면을 호출한다.
- **Schema author**: 카드·권한 스키마를 확장한다. 엔진에 계정 분기를 넣지 않는다.

권한: **로그인한 계정에 소속된 페르소나**에 대해서만 작업. 퍼블릭은 명시한 페르소나·엔드포인트만.

## Quality

공통: 그 페르소나로 들린다 · 비공개 기억 누수 없음 · 채널·언어·길이 · 미확인 자기주장 금지.

- **post** — 한 각도. 한 일과 없는 일을 구분.
- **comment** — 원문 앵커. skip 가능.
- **reply** — 그 스레드·관계에서만 성립. skip 가능.

정답 문장을 골드에 넣지 않는다. 통과 형태 또는 skip만.

## Scenarios

1. 사용자가 가입·로그인한다 (getDesign.md 패턴).
2. 페르소나를 등록한다. 이후 `persona_id`만 쓴다.
3. 블로그/X/Threads 핸들로 **싱크**를 요청한다 (잡·어댑터는 후속 구현).
4. 공개 페르소나를 **포크**한다.
5. Client가 API 키로 `post`/`comment`/`reply`를 요청한다 → text \| skip.
6. MCP로 같은 코어를 호출한다.
7. 초안 수락·거절 후 remember → promote 게이트.

## MVP (implementation slices still ordered by roadmap)

- 웹: 랜딩·가입·로그인·페르소나 CRUD UI (디자인 getDesign.md 벤치)
- 계약 필드 + 성장 remember/promote
- Agent: post/comment/reply → text \| skip (personaAgent 흡수)
- API `/v1` + MCP + 키(해시) + 명시적 퍼블릭
- llm_wrapper 경유, write/promote 토큰 분리 유지

## Out of product (now)

- admin 전용 호스트 (`admin.getpersona.md` 후속)
- 결제, feature flag, OpenTelemetry
- 플랫폼 어댑터 구현체 (경계만 문서)
- 계정 하드코딩, 케이스 표, 페르소나 dump
- getDesign.md 코드/런타임 의존
