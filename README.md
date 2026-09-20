# getPersona.md

Official **public persona contracts**. Checkout a voice. This is **not** the application source.

Product site: [getpersona.md](https://getpersona.md) · Korean UI is the default; English under `/en`.

```
user/          personal  — a portable self (submit via issue/PR; no sample selves shipped)
public/        public    — figure compiled from the public record
roles/         role      — a job an agent inhabits, grouped by crew
```

- Contract schema (English headings): [`PERSONA.md`](./PERSONA.md)
- Korean overview of this repo: [`README.ko.md`](./README.ko.md)
- **One file per voice:** `PERSONA.md` only. There is no `PERSONA.ko.md`.
- Body language is `native`. Languages the voice may answer in are `speaks` (must include `native`).

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-coding/developer
cat roles/vibe-coding/developer/PERSONA.md
```

## Language (D-078)

| Kind | Typical `native` | Typical `speaks` |
| --- | --- | --- |
| English public figures | `en` | `en` |
| Korean-only public figures (e.g. 유재석, 백종원) | `ko` | `ko` |
| Bilingual public figures (e.g. 손흥민, 봉준호) | `ko` | `ko, en` |
| Role crews | `en` | `ko, en` |

Site locale (`/` vs `/en`) filters by `speaks`. It does not pick a twin file.

## Public figures

| Slug | Display | native | speaks |
| --- | --- | --- | --- |
| [musk-x](./public/musk-x/) | Musk · X | en | en |
| [trump-rally](./public/trump-rally/) | Trump · Rally | en | en |
| [jobs-keynote](./public/jobs-keynote/) | Jobs · Keynote | en | en |
| [oprah-own](./public/oprah-own/) | Oprah · Own | en | en |
| [dieter-rams](./public/dieter-rams/) | Rams · Less | en | en |
| [bong-cinema](./public/bong-cinema/) | 봉준호 · Cinema | ko | ko, en |
| [son-pitch](./public/son-pitch/) | 손흥민 · Pitch | ko | ko, en |
| [yoo-variety](./public/yoo-variety/) | 유재석 · Variety | ko | ko |
| [baek-table](./public/baek-table/) | 백종원 · Table | ko | ko |

## Role crews

Listed on the product landing:

1. **[vibe-coding](./roles/vibe-coding/)** — Vibe Crew (`vc-*`). Apply on site: `/personas/apply/vibe-coding`
2. **[blog-author](./roles/blog-author/)** — Blog author (`ba-*`). Apply: `/personas/apply/blog-author`

Also in this tree (apply API / catalog files; not listed on landing):

3. **[storydesk](./roles/storydesk/)** — `sd-*`
4. **[saju](./roles/saju/)** — `sj-*`
5. **[tarot](./roles/tarot/)** — `tr-*`
6. **[counsel](./roles/counsel/)** — `cc-*`

Each crew folder has role seats as `roles/<crew>/<role>/PERSONA.md`. Roles use `native: en`, `speaks: ko, en`.

### vibe-coding (Vibe Crew)

| Role | Slug |
| --- | --- |
| [orchestrator](./roles/vibe-coding/orchestrator/) | `vc-orchestrator` |
| [planner](./roles/vibe-coding/planner/) | `vc-planner` |
| [developer](./roles/vibe-coding/developer/) | `vc-developer` |
| [dba](./roles/vibe-coding/dba/) | `vc-dba` |
| [reviewer](./roles/vibe-coding/reviewer/) | `vc-reviewer` |
| [deployer](./roles/vibe-coding/deployer/) | `vc-deployer` |
| [scm](./roles/vibe-coding/scm/) | `vc-scm` |
| [ui-designer](./roles/vibe-coding/ui-designer/) | `vc-ui-designer` |
| [ux](./roles/vibe-coding/ux/) | `vc-ux` |

### blog-author

| Role | Slug |
| --- | --- |
| [lead](./roles/blog-author/lead/) | `ba-lead` |
| [topic](./roles/blog-author/topic/) | `ba-topic` |
| [outline](./roles/blog-author/outline/) | `ba-outline` |
| [author](./roles/blog-author/author/) | `ba-author` |
| [experience](./roles/blog-author/experience/) | `ba-experience` |
| [review](./roles/blog-author/review/) | `ba-review` |
| [media](./roles/blog-author/media/) | `ba-media` |
| [polish](./roles/blog-author/polish/) | `ba-polish` |

## Personal (`user/`)

No sample selves. Submit via [getpersona.md/personas/submit](https://getpersona.md/personas/submit) (issue or PR). Files land at `user/<slug>/PERSONA.md`.

Do not put legal names, contacts, or private facts in the contract.

## Sync

This mirror is published from the application catalog (`personas/catalog/` in the private monorepo) via `scripts/publish-public-contracts.sh`. Crew **apply prompts** on the product fetch from the application repo; this public tree is for browse and sparse-checkout.

한국어: [README.ko.md](./README.ko.md)
