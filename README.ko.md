[한국어](README.ko.md) | [English](README.md)

# getPersona.md

제품 사이트에서 페르소나를 고르고, 짧게 말해 본 뒤, 이미 쓰는 AI에 그대로 적용하세요.

**제품:** [getpersona.md](https://getpersona.md)

## 이게 뭔가요

페르소나는 AI에게 “이번 대화에서는 이렇게 말하라”고 알려 주는 짧은 설명입니다. 누구의 목소리인지, 무엇을 지키는지, 어디서 선을 긋는지가 적혀 있습니다.

각 페르소나는 이 깃허브에 파일 하나로 있고, [getpersona.md](https://getpersona.md)에서 목록을 보고 사이트에서 짧게(대략 세 번) 대화해 볼 수 있습니다. ChatGPT, Claude, Cursor에서 그 목소리를 계속 쓰려면 사이트의 **적용 문장**을 복사해 그 도구에 붙여 넣으면 됩니다. 그러면 그 AI가 여기서 설명을 불러와 그 목소리로 답합니다.

- **적용에는 계정이 필요 없습니다.**
- 사이트에 저장해 두고 싶을 때만 가입하면 됩니다.
- “나처럼 말하는” 개인 페르소나를 제품에서 만드는 기능은 아직 대기열 단계입니다.

## 적용하는 방법

1. [getpersona.md](https://getpersona.md)에서 페르소나를 고릅니다.
2. (선택) 사이트에서 짧게 대화해 목소리를 들어 봅니다.
3. 페르소나 페이지에서 **적용 문장**을 복사합니다.
4. ChatGPT, Claude, Cursor에 붙여 넣습니다.
5. 그 AI가 설명을 불러와 그 목소리로 답합니다.

평소에는 파일을 직접 받을 필요가 없습니다.

## 적용하면 AI가 어떻게 달라지나요

붙여 넣은 AI가 그 페르소나의 말투·우선순위·선을 따라갑니다. 평범한 비서 말투로 돌아가면, 새 대화에서 적용 문장을 다시 붙여 넣으세요.

## 개인 페르소나 올리기 (이슈 / 변경 제안)

공개 목록에 올릴 개인 페르소나는 누구나 제안할 수 있습니다. 깃허브가 익숙하지 않다면 사이트 버튼을 쓰는 편이 쉽습니다.

1. [개인 페르소나 등록](https://getpersona.md/personas/submit) 페이지를 엽니다.
2. **가장 쉬운 방법:** **이슈로 검수 받기**를 누릅니다. 초안이 채워진 깃허브 이슈가 열립니다. 통과하면 여기에 `user/<이름>/` 아래로 올립니다.
3. **깃허브를 아는 경우:** **파일 만들기**로 변경을 제안합니다. 먼저 포크가 필요할 수 있습니다. 합쳐지면 목록에 나타납니다.

실명·전화번호·이메일·사적인 내용은 넣지 마세요.

## 이 저장소에 있는 것

```
user/      사람들이 공유한 개인 페르소나
public/    공개 인물
roles/     직무 역할 (팀 단위)
```

목소리마다 폴더 하나, 그 안에 설명 파일(`PERSONA.md`) 하나가 있습니다.

제품 랜딩에 보이는 팀:

1. **[vibe-coding](./roles/vibe-coding/)** — 바이브크루 · 사이트에서 적용: `/personas/apply/vibe-coding`
2. **[blog-author](./roles/blog-author/)** — 블로그 저자 · `/personas/apply/blog-author`

## 개발자용 (선택)

폴더 하나만 받고 싶다면:

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-coding/developer
cat roles/vibe-coding/developer/PERSONA.md
```

대부분은 이 단계 없이 [getpersona.md](https://getpersona.md)의 적용 문장만 쓰면 됩니다.
