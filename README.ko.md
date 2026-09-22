[한국어](README.ko.md) | [English](README.md)

# getPersona.md

> ⭐ **이 저장소가 도움이 됐다면 Star 해 주세요** — 더 많은 사람이 찾을 수 있어요.
> [GitHub에서 Star](https://github.com/goodtekxyz/getPersona.md)

AI 에이전트에 페르소나를 부여하세요.

**제품:** [getpersona.md](https://getpersona.md)

## 이게 뭔가요

**PERSONA.md**는 AI 에이전트가 페르소나처럼 읽고, 말하고, 행동하게 만드는 한 장짜리 설명입니다.

- **내 말투** — 에이전트 하나에 페르소나를 부여해, 원하는 목소리로 말하게 할 때
- **그룹 페르소나** — 역할마다 페르소나를 나눠, 한 팀처럼 같이 일하게 할 때

[getpersona.md](https://getpersona.md)에서 페르소나를 고르고, **적용하기**를 복사해 ChatGPT·Claude·Cursor에 붙여 넣으면 됩니다. 적용에는 계정이 필요 없습니다.

## 적용하는 방법

1. [getpersona.md](https://getpersona.md)에서 페르소나를 고릅니다.
2. (선택) 사이트에서 짧게 대화해 말투를 들어 봅니다.
3. **적용하기**를 복사해 ChatGPT, Claude, Cursor에 붙여 넣습니다.
4. 그 에이전트가 페르소나를 읽고 그처럼 일하고 말합니다.

## 적용하면

에이전트가 그 페르소나의 말투·우선순위·선을 따릅니다. 말투가 풀리면 새 대화에서 적용하기를 다시 붙여 넣으세요.

## 개인 페르소나 올리기

1. [개인 페르소나 등록](https://getpersona.md/personas/submit)을 엽니다.
2. **이슈로 검수 받기**(가장 쉬움) 또는 **파일 만들기**/변경 제안을 고릅니다.
3. 통과·합쳐지면 목록에 나타납니다.

실명·연락처·사적인 내용은 넣지 마세요.

## 이 저장소

```
user/      개인 페르소나
public/    공개 인물
roles/     역할·그룹 페르소나
```

제품에 보이는 그룹: [vibe-crew](./roles/vibe-crew/) · [blog-author](./roles/blog-author/)

## 개발자용 (선택)

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-crew/developer
cat roles/vibe-crew/developer/PERSONA.md
```

대부분은 사이트에서 적용하기만 쓰면 됩니다.

## goodtek이 만듭니다.

같은 팀이 만드는 제품·커뮤니티:

- [goodtek](https://goodtek.xyz) — 회사·제품 허브
- [llms](https://llms.goodtek.xyz) — 여러 LLM 계정 라우팅
- [vibePulse](https://vibepulse.goodtek.xyz) — 웹·API 업타임 모니터
- [바이브크루](https://vibecrew.kr) — 한국어 바이브코딩 빌더 커뮤니티
