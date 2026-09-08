# PERSONA.md

> **공식 공개 페르소나 계약 (v0.1)** — 한글 설명  
> 스키마 원본은 영어 [`PERSONA.md`](./PERSONA.md)다. 이 파일은 같은 규격이다. `schemaVersion`을 하나 더 만들지 않는다.  
> 공개 데이터만. 프라이빗 소울은 여기에 두지 않는다.

---

## 한 줄

**PERSONA**는 에이전트가 목소리를 입기 위해 읽는 휴대용 공개 계약이다. 사적 기억은 포함하지 않는다.

페르소나 파일은 무드보드가 아니다. `warm`, `재치 있음` 같은 형용사는 압박에서 거의 먹지 않는다. 다음만 필수로 둔다.

1. 누가 말하는가 (`identity.who`)
2. 무엇을 하려고 말하는가 (`identity.intent`)
3. 충돌하면 무엇이 이기는가 (`priorities`)
4. 검증 가능한 말 습관 (`speech.habits`)
5. 이미 그 입으로 나온 문장 (`samples`)
6. 하드 스톱 (`refusals`)

필드가 다음 토큰을 바꾸지 못하면 필수에서 뺀다.

---

## 언어

| 구분 | 어디에 | 언어 |
| --- | --- | --- |
| 스키마 | `PERSONA.md` | 영어 하나 |
| 사람용 설명 | 이 파일, `README.ko.md` | 한국어 |
| 그 페르소나의 입 | `identity.language` | `ko` 또는 `en` 등 **하나** |

한 계약에 한·영 샘플을 섞지 않는다. Jobs 목소리는 영어 샘플만, 봉준호 목소리는 한글 샘플만.

---

## 작성 — 인터뷰가 컴파일한다 (D-021)

사람이 `habits` / `samples` / `priorities`를 폼에 직접 적지 않는다.  
인터뷰어가 묻고, 컴파일러가 v0.1 JSON을 쓰고, 사람은 **컴파일된 줄을 승인하거나 거절**만 한다.  
인터뷰 원문은 계약이 아니다 (소울 유출).

인터뷰 언어 = 지금 대화 언어.  
`identity.language` = 그 목소리의 언어. 둘이 달라도 된다.

1. **Frame** — 이 목소리는 공개에서 무엇을 하나. 누구로 말하나. 목소리는 어느 언어인가.
2. **Speak** — 그 입으로 답 세 번. 말 행위를 다르게 (단언 / 거절 / 초대, 또는 관찰 / 질문 / 자르기). 그 답이 샘플 후보.
3. **Conflict** — 두 가치가 부딪히면 무엇이 이기는가 → `priorities`.
4. **Hard no** — 절대 하지 않을 말·자처 → `refusals`.
5. **Confirm** — 컴파일된 `persona.json`만 보여 준다. `register` / `length` / `person`은 샘플에서 추론한다. 빈칸을 채우게 하지 않는다.

“습관 세 개 적어 주세요”, “말투가 어때요?”는 묻지 않는다. 습관은 **어떻게 말했는지**에서 뽑고, 아래 규칙으로 린트한다.

---

## 필수 필드 (v0.1)

키 이름은 영어 그대로다. 에이전트·JSON이 이 키를 읽는다.

| 필드 | 의미 |
| --- | --- |
| `schemaVersion` | `"0.1"` |
| `slug` | kebab-case id |
| `name` | 표시 이름 |
| `summary` | 한 줄 소개 (≤200) |
| `license` | 재사용 (`CC-BY-4.0`, `CC0-1.0`, `ARR` …) |
| `identity.who` | 공개에서 맡는 역할 (법적 본인 주장 아님) |
| `identity.intent` | 말할 때 하는 일 |
| `identity.language` | `ko`, `en`, … |
| `speech.register` | `formal` \| `neutral` \| `casual` |
| `speech.length` | `terse` \| `short` \| `medium` \| `long` |
| `speech.person` | `first` \| `first_plural` \| `second` \| `third` |
| `speech.habits` | 1–5. 판정 가능한 지시. 나쁜 예: `재치 있음`. 좋은 예: `농담을 설명하지 않는다` |
| `priorities` | 2–7, **순서**. 충돌 때 이기는 값 |
| `samples` | 2–5. 이미 말하는 문장. 카탈로그는 **3줄 이상**, 말 행위 **2종 이상** |
| `refusals` | 1–12. 하드 경계 |

습관 한 줄에 제약 하나. `priorities`를 습관으로 다시 쓰지 않는다.  
샘플은 유명 슬로건·자기소개가 아니다. kind별 맵이나 질문–답 페어를 만들지 않는다.

선택: `tags`, `links`, `publicFacts`, `attribution`, `repoUrl`, `cloneUrl`.  
나이·가족은 **공개하기로 한 경우만**. 일기·DM·의료/금융·관계 그래프는 금지.

---

## 에이전트가 읽는 법

1. 공개 계약을 로드한다 (URL, git, 카탈로그).
2. 짧게 투영한다: who + intent + priorities + speech + refusals + samples.
3. 소울을 붙여 넣지 않는다.
4. 충돌이면 앞선 `priorities`. `refusals`는 항상 이긴다.

계약 = 헌법. 소울 = 그 아래의 삶. 소울은 계약이 생긴 뒤에 붙인다.

---

## 공식 예시

영어 목소리 `jobs-keynote`. JSON은 [`PERSONA.md`](./PERSONA.md) §6과 `personas/catalog/jobs-keynote/persona.json`과 같다.

체크아웃:

```bash
git clone https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md/jobs-keynote
```
