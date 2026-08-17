# Agent API

> 논리 계약. 경로 문자열과 필드 이름은 설계 TASK에서 고정해도 된다. 능력은 여기서 잠근다.

## Surface

MVP 표면은 **HTTP JSON API** 하나다. CLI와 MCP는 같은 코어를 나중에 얹는다. 표면마다 retrieve나 승격을 다시 구현하지 않는다.

인증은 최소 두 토큰이다.

| Token | May |
|-------|-----|
| Write | 조회, `remember`, `write` |
| Promote | 후보 → LTM. 정체성·보이스·경계는 추가 게이트 |

쓰기 토큰으로 승격하지 못한다. `/health`만 인증 없이 연다.

## Persona — 등록·관리

| Op | Does |
|----|------|
| `CreatePersona` | 최소 계약으로 등록. `persona_id` 반환 |
| `ListPersonas` | 이 인스턴스가 쓸 수 있는 페르소나 |
| `GetPersona` | 관리용 계약 조회. 기억 dump 아님 |
| `PatchPersona` | identity / voice / boundaries / permissions 부분 수정 |
| `ArchivePersona` | 이후 write 거부. 삭제가 기본이 아님 |

`GetPersona`는 운영자용이다. 쓰기 에이전트는 `Project`만 본다.

## Growth

| Op | Does |
|----|------|
| `Remember` | 에피소드와 후보를 남긴다. 승격하지 않는다 |
| `Promote` | 후보를 LTM으로 옮긴다. Promote 토큰 |
| `Project` | 이번 일용 컴파일 계약 + 좁은 기억 창 |

`Remember`는 멱등해야 한다. 키는 `source_kind + source_id`다.

## Write

| Op | Does |
|----|------|
| `Write` | `persona_id` + `kind` + source → `text` \| `skip` |
| `GetRun` | 사용한 기억, 판정, 후보. 디버그·감사 |

### Write input (minimum)

- `persona_id`
- `kind`: `post` \| `comment` \| `reply`
- `channel` / `language`
- `source`: brief, 원문, 스레드
- `subjects` (닫힌 슬롯): `own`, `speaker`, `host`, `about` — 열린 자유 필드가 아님
- `constraints`: 길이, 링크, 공개 범위

### Write output (minimum)

- `status`: `text` \| `skip`
- `text` 또는 `reason`
- `run_id`
- `memory_used` (id 목록)
- 후보는 pending. 응답이 LTM을 바꾸지 않는다

`Write`는 동기여도 된다. 모델 루프라 수십 초가 걸릴 수 있다. 클라이언트 타임아웃을 전제로 한다. 비동기 잡은 후속.

## Health

`Health` — 프로세스 생존. 페르소나·모델 준비와 섞지 않는다.

## Rules

- 페르소나 전체나 memory dump를 응답하지 않는다.
- 내부 용어(`getPersona`, 카드 테이블명, compile 단계명)가 공개 문장에 나오면 실패다.
- 버전·레이트 리밋·감사 로그는 MVP 밖. 신뢰 네트워크 API로 취급한다.
- 스키마는 한 코어에서 나온다. HTTP가 다른 승격 규칙을 갖지 않는다.
