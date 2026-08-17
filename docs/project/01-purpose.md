# Purpose

> 문제와 경계가 바뀌면 갱신한다.

## One line

**getPersona.md**는 페르소나를 등록·싱크·포크·성장시키고, 웹에서 운영하며, `agent`로 포스팅·댓글·대댓글을 쓰거나 skip하는 제품이다. 연결은 API와 MCP다.

## Problem

페르소나 없이 모델을 부르면 글이 계정과 섞이고, 기억을 통째로 넣으면 느리고 새며, 한 번 쓰고 끝나면 다음 글이 나아지지 않는다. 운영 면(가입·등록·싱크)이 없으면 엔진만 남고 제품이 아니다.

- 등록이 없으면 매 호출마다 정체성을 다시 설명한다.
- 관리·싱크가 없으면 보이스·금지가 흩어지고, 실제 사람/채널과 맞지 않는다.
- 성장이 없으면 다음 retrieve가 정확해지지 않는다.
- 글 종류를 무시하면 댓글이 설명문이 되고 포스팅이 반응이 된다.

## What this product is

- 페르소나의 시스템 오브 레코드: 정체성, 보이스, 경계, 권한, 기억.
- 웹: 랜딩, 회원가입, 로그인, 페르소나 등록·싱크·포크 (UX는 `getDesign.md` 벤치마크).
- Agent 표면: post / comment / reply 등 역할 에이전트 (`agent.getpersona.md`).
- 연결: REST API + MCP (`api.getpersona.md`). 키 또는 (명시적) 퍼블릭.

## What this product is not

- 소셜 게시 스케줄러·피드 수집기·브라우저 드라이버의 **대체 본체** (어댑터는 후속; 게시는 클라이언트/어댑터 쪽일 수 있음).
- 일반 챗봇이나 장문 블로그 엔진.
- 페르소나 파일을 통째로 프롬프트에 넣는 래퍼.
- 계정별 `if`가 박힌 엔진.
- `getDesign.md` 자체 (벤치마크용 다른 서비스).

## Adjacent systems

| System | Owns (today) |
|--------|----------------|
| **getPersona.md (this repo)** | 제품·SoR·웹·agent·API/MCP 구현 |
| **getDesign.md** | 디자인·레이아웃·가입 UX **벤치마크** (코드 공유 없음) |
| personaAgent | 기존 쓰기 엔진 — **이 레포 agent로 흡수** (구현 TASK) |
| personaLoop | 수집·스케줄·게시 클라이언트 후보 |
| llm_wrapper | 모델 호출 게이트웨이 (**유일한** LLM 경로) |

## Locked sentence

페르소나가 원본이다. 글은 그 페르소나의 투영이다. Agent는 문장 또는 skip을 만든다. API·MCP는 연결이다. 디자인 벤치마크는 getDesign.md다.
