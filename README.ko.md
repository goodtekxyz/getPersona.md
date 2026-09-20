# getPersona.md

공식 **공개 페르소나 계약** 저장소입니다. 목소리를 체크아웃하는 곳이며, **앱 소스가 아닙니다**.

제품: [getpersona.md](https://getpersona.md) · 기본 UI는 한국어, 영어는 `/en`.

```
user/          개인  — 가져가는 나 (이슈/PR로 등록; 샘플 자아는 없음)
public/        공개  — 공개 기록으로 컴파일한 인물
roles/         역할  — 에이전트가 입는 직무, 크루 단위
```

- 계약 스키마 (영문 헤딩): [`PERSONA.md`](./PERSONA.md)
- English overview: [`README.md`](./README.md)
- **목소리당 파일은 하나:** `PERSONA.md`만 씁니다. `PERSONA.ko.md`는 없습니다.
- 본문 언어는 `native`, 답할 수 있는 언어는 `speaks`(`native` 포함)입니다.

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-coding/developer
cat roles/vibe-coding/developer/PERSONA.md
```

## 언어 (D-078)

| 종류                                      | 보통 `native` | 보통 `speaks` |
| ----------------------------------------- | ------------- | ------------- |
| 영어 공개 인물                            | `en`          | `en`          |
| 한국어 전용 공개 인물 (유재석, 백종원 등) | `ko`          | `ko`          |
| 이중 언어 공개 인물 (손흥민, 봉준호 등)   | `ko`          | `ko, en`      |
| 역할 크루                                 | `en`          | `ko, en`      |

사이트 언어(`/` · `/en`)는 `speaks`로 걸러 줍니다. 언어별 트윈 파일을 고르지 않습니다.

## 공개 인물

| Slug                                   | 표시             | native | speaks |
| -------------------------------------- | ---------------- | ------ | ------ |
| [musk-x](./public/musk-x/)             | Musk · X         | en     | en     |
| [trump-rally](./public/trump-rally/)   | Trump · Rally    | en     | en     |
| [jobs-keynote](./public/jobs-keynote/) | Jobs · Keynote   | en     | en     |
| [oprah-own](./public/oprah-own/)       | Oprah · Own      | en     | en     |
| [dieter-rams](./public/dieter-rams/)   | Rams · Less      | en     | en     |
| [bong-cinema](./public/bong-cinema/)   | 봉준호 · Cinema  | ko     | ko, en |
| [son-pitch](./public/son-pitch/)       | 손흥민 · Pitch   | ko     | ko, en |
| [yoo-variety](./public/yoo-variety/)   | 유재석 · Variety | ko     | ko     |
| [baek-table](./public/baek-table/)     | 백종원 · Table   | ko     | ko     |

## 역할 크루

제품 랜딩에 노출:

1. **[vibe-coding](./roles/vibe-coding/)** — 바이브크루 (`vc-*`). 적용: `/personas/apply/vibe-coding`
2. **[blog-author](./roles/blog-author/)** — 블로그 저자 (`ba-*`). 적용: `/personas/apply/blog-author`

같은 트리에 있음 (적용 API·카탈로그 파일; 랜딩 비노출):

3. **[storydesk](./roles/storydesk/)** — `sd-*`
4. **[saju](./roles/saju/)** — `sj-*`
5. **[tarot](./roles/tarot/)** — `tr-*`
6. **[counsel](./roles/counsel/)** — `cc-*`

좌석은 `roles/<크루>/<역할>/PERSONA.md`. 역할은 `native: en`, `speaks: ko, en`.

### vibe-coding (바이브크루)

| 역할                                              | Slug              |
| ------------------------------------------------- | ----------------- |
| [orchestrator](./roles/vibe-coding/orchestrator/) | `vc-orchestrator` |
| [planner](./roles/vibe-coding/planner/)           | `vc-planner`      |
| [developer](./roles/vibe-coding/developer/)       | `vc-developer`    |
| [dba](./roles/vibe-coding/dba/)                   | `vc-dba`          |
| [reviewer](./roles/vibe-coding/reviewer/)         | `vc-reviewer`     |
| [deployer](./roles/vibe-coding/deployer/)         | `vc-deployer`     |
| [scm](./roles/vibe-coding/scm/)                   | `vc-scm`          |
| [ui-designer](./roles/vibe-coding/ui-designer/)   | `vc-ui-designer`  |
| [ux](./roles/vibe-coding/ux/)                     | `vc-ux`           |

### blog-author

| 역할                                          | Slug            |
| --------------------------------------------- | --------------- |
| [lead](./roles/blog-author/lead/)             | `ba-lead`       |
| [topic](./roles/blog-author/topic/)           | `ba-topic`      |
| [outline](./roles/blog-author/outline/)       | `ba-outline`    |
| [author](./roles/blog-author/author/)         | `ba-author`     |
| [experience](./roles/blog-author/experience/) | `ba-experience` |
| [review](./roles/blog-author/review/)         | `ba-review`     |
| [media](./roles/blog-author/media/)           | `ba-media`      |
| [polish](./roles/blog-author/polish/)         | `ba-polish`     |

## 개인 (`user/`)

샘플 자아는 없습니다. [getpersona.md/personas/submit](https://getpersona.md/personas/submit)에서 이슈 또는 PR로 등록합니다. 파일 위치는 `user/<slug>/PERSONA.md`.

실명·연락처·비공개 정보는 계약에 넣지 마세요.

## 동기화

이 미러는 앱 카탈로그(`personas/catalog/`)에서 `scripts/publish-public-contracts.sh`로 게시합니다. 제품의 **적용 프롬프트**는 **이** 공개 트리에서 raw `PERSONA.md`를 가져옵니다 (`roles/…`, `public/…`). 카탈로그를 바꾼 뒤에는 미러를 다시 게시하세요.

English: [README.md](./README.md)
