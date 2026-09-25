# PERSONA.md

> **Public persona contract — world format (v0.2)**  
> getPersona.md locks this SoR the way `DESIGN.md` locks UI.  
> Only **public** data. Private soul never belongs here.  
> v0.2 is **additive**: v0.1 files still parse; writers emit Meta and prefer Policy / Success / Provenance.

---

## 0. Cold premise

A persona file is not a mood board.

LLMs already overfit to vague adjectives (`warm`, `blunt`, `witty`).  
Those words feel like personality and **do almost nothing** under pressure.

What actually changes generation:

1. **Who is speaking** (public framing)
2. **What they are trying to do** (purpose)
3. **What they optimize for when values conflict** (priorities)
4. **Concrete speech constraints** (observable habits, not vibes)
5. **Examples** (few-shot beats adjectives)
6. **Hard refusals** (character integrity)
7. **Structured policy** (safety categories, not only free-text refusals)
8. **Observable success** (what “done” looks like for this seat)

If a field cannot change an agent’s next token under conflict, it does not belong in the required set.

---

## 1. One sentence

**PERSONA** is a portable, public contract an agent can load to inhabit a voice — without private memory.

It is an **embodiment / constitution** format. It is **not** an A2A Agent Card, MCP tool descriptor, or transport endpoint list. Those may be **projected** from PERSONA (see `PERSONA-AGENT-CARD.md`) but must not replace this file.

---

## 2. Layers (D-018)

| Layer               | Artifact      | Visibility      | Contains                                                                              |
| ------------------- | ------------- | --------------- | ------------------------------------------------------------------------------------- |
| **Public contract** | `PERSONA.md`  | Always public   | Identity, purpose, speech, priorities, samples, refusals, policy, success, provenance |
| **Private soul**    | Platform only | Account-private | Relationships, experience, remember → promote                                         |

Age, family, biography may appear **only if the author chooses to publish them** (`## Public facts`).  
Diaries, DMs, medical/financial secrets, trust graphs, LTM dumps — **never** in this file.

---

## 3. Design principles

1. **Public by construction** — anything in the file is shareable, forkable, indexable.
2. **Embodiment over aesthetics** — fields must steer behavior, not decorate a card.
3. **Examples > adjectives** — prefer sample lines and concrete habits.
4. **Priorities > “stance”** — ordered values beat mood labels.
5. **Refusals are hard** — soft preferences go in habits; hard stops go in refusals / policy.
6. **Additive evolution** — `schemaVersion` bumps; never relocate soul data into the contract.
7. **One format** — famous showcase and user-published personas use the same schema.
8. **Machine-readable meta** — `## Meta` carries `schema` / `kind` / `license` so a file alone is auditable.
9. **Host packs ≠ this file** — AGENTS.md / CLAUDE.md / Cursor rules may _apply_ a crew; PERSONA.md stays the inhabit SoR.

### Rejected as required fields

| Tempting field                       | Why rejected                                           |
| ------------------------------------ | ------------------------------------------------------ |
| Free-text **말투 / tone adjectives** | Weak signal; collapses to stereotype                   |
| Free-text **성향 / MBTI / Big Five** | Pseudopsychology; poor agent control                   |
| **System prompt** blob               | Opaque, non-portable, invites private leakage          |
| **Memory / RAG hooks**               | Soul layer — not public                                |
| **Tool allow-lists**                 | Runtime/product concern; not the public voice contract |
| **Private relationships**            | Soul layer                                             |
| **Live endpoints / A2A url**         | Host Agent Card concern — see mapping doc              |

---

## 4. Required fields (v0.2)

### 4.1 Meta (`## Meta`) — machine header

| Field     | Type / values                    | Why                                       |
| --------- | -------------------------------- | ----------------------------------------- |
| `schema`  | `0.1` \| `0.2`                   | Format conformance (writers emit `0.2`)   |
| `kind`    | `personal` \| `public` \| `role` | Same as folder kind; duplicated for audit |
| `slug`    | kebab-case                       | Stable id (folder still wins on conflict) |
| `license` | SPDX-style id (e.g. `CC-BY-4.0`) | Reuse rules; mirror of `## License`       |

Folder path remains authoritative for slug/kind when Meta is absent (v0.1 compat).  
**0.2-catalog** conformance: Meta SHOULD be present in the file.

### 4.2 Identity / Speech / Priorities / Samples / Refusals

Unchanged in meaning from v0.1 (see prior tables), except language. `identity.native` is the one content language. `identity.speaks` is every language the voice may answer in, and it includes `native`. `identity.language` is `speaks` joined with `, ` so older readers still see one line. A single legacy code (`en` or `ko`) fills both. `ko, en` without `native` is refused.

### 4.3 Kind (catalog layout)

| Field  | Type                             | Why                                                            |
| ------ | -------------------------------- | -------------------------------------------------------------- |
| `kind` | `personal` \| `public` \| `role` | Which tree the contract lives in. Default `public` if omitted. |

```
user/<slug>/PERSONA.md                 kind=personal
public/<slug>/PERSONA.md               kind=public
roles/<domain>/<role>/PERSONA.md       kind=role   (crew layout)
```

One schema. Three jobs: a portable self, a public-figure contract, a role an agent inhabits.

---

## 5. Optional (public by choice) — v0.2 additive

| Field                  | Type                         | Notes                                                      |
| ---------------------- | ---------------------------- | ---------------------------------------------------------- |
| `tags`                 | string[]                     | Discovery                                                  |
| `links`                | url[] (`## Links`)           | Public sites only                                          |
| `publicFacts`          | string[] (`## Public facts`) | Age band, hometown, job — **only if intentionally public** |
| `attribution`          | string                       | Human provenance prose                                     |
| `provenance`           | object (`## Provenance`)     | `notARealPerson: true/false`, `source: {url\|note}` lines  |
| `laws`                 | string[]                     | Role crews. Additive working rules (`## Laws`)             |
| `policy`               | PolicyEntry[] (`## Policy`)  | Structured safety: `category/severity: note`               |
| `success`              | string[] (`## Success`)      | Observable checks that the seat did its job                |
| `contractVersion`      | SemVer                       | Content version (`## Version` → `contract:`)               |
| `contractUpdated`      | `YYYY-MM-DD`                 | Last content change                                        |
| `changelog`            | string[]                     | Recent content notes                                       |
| `repoUrl` / `cloneUrl` | url                          | Distribution envelope (catalog / git)                      |

### 5.1 Policy categories

`age` · `dual-use` · `medical` · `legal` · `financial` · `cyber` · `privacy` · `likeness` · `crisis` · `other`  
Severity: `hard` (default) · `soft` · `advisory`  
Line form: `- medical/hard: No diagnosis; suggest professional care`

### 5.2 Kind completeness matrix

| Field / section     | personal | public                    | role          |
| ------------------- | -------- | ------------------------- | ------------- |
| Core 6 + Meta       | MUST     | MUST                      | MUST          |
| Policy              | SHOULD   | SHOULD                    | SHOULD        |
| Success             | MAY      | MAY                       | SHOULD        |
| Laws                | MAY      | MAY                       | SHOULD        |
| Version/Changelog   | MAY      | SHOULD                    | MUST (crews)  |
| Provenance          | MAY      | SHOULD (`notARealPerson`) | MAY           |
| Attribution+License | SHOULD   | MUST (market)             | MUST (market) |

### 5.3 i18n (D-078)

- One contract file: `PERSONA.md`. There is no `PERSONA.ko.md`.
- Headings stay English (`## Who`, `## Intent`, `## Language`, `register` / `length` / `person`).
- Body language is `native`. Catalog locale filter and “answer in the user’s language” use `speaks`.
- Role contracts are `native: en`, `speaks: ko, en`. Korean role names stay in UI messages, not in the contract.
- A public voice whose body is Korean keeps that body. `yoo-variety` and `baek-table` speak Korean only. `son-pitch` and `bong-cinema` speak Korean and English; the file stays Korean.

### 5.4 Style voices (crew extension — D-085)

Crews may ship **style voice** seats for prose cadence without a new `kind` or new required headings.

| Rule                 | Detail                                                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kind / path          | Still `kind: role` at `roles/<domain>/voice-<id>/PERSONA.md` (depth 3 — same loader).                                                                                                                                       |
| What goes where      | **Speech.habits** = breath/register habits · **Samples** = few-shot lines · **Refusals** = banned rhythms/phrases · **Laws** = when to attach / language gate · **Policy.likeness** + **Provenance** = not the real writer. |
| Do not add           | Free-text “말투” adjectives, MBTI, or a custom `## Style` heading (round-trip would drop unknown sections).                                                                                                                 |
| Crew wiring          | Optional `CrewDefinition.voices: { role, native }[]`. Lead picks by post language; process seat (e.g. author) **dual-attaches** process + voice.                                                                            |
| Blog Author defaults | `ko` → `voice-maker-brief-ko` · `en` → `voice-pg-essay`. Optional: `voice-tech-blogger-ko`, `voice-kim-honbi-essay`.                                                                                                        |

Process seats stay job routers (`lead`, `author`, …). Style voices stay cadence-only and must not invent biography.

---

## 6. Canonical `PERSONA.md` (v0.2)

```markdown
# {name}

{summary}

## Meta

- schema: 0.2
- kind: role
- slug: vc-developer
- license: CC-BY-4.0

## Who

## Intent

## Language

- native: en
- speaks: ko, en

## Speech

- register: neutral
- length: short
- person: first
- {habit}

## Priorities

1. {priority}

## Samples

- {sample}

## Refusals

- {refusal}

## Policy

- privacy/hard: {note}

## Success

- {observable check}

## License

CC-BY-4.0
```

---

## 7. Conformance

| Level           | Meaning                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| **0.2-core**    | Required fields; enums valid; ≥2 samples; ≥2 priorities; ≥1 refusal; ≥1 habit; Meta preferred |
| **0.2-catalog** | core + Meta present + `repoUrl` or resolvable tree URL                                        |
| **0.2-market**  | catalog + SPDX-style `license` + `attribution` + Policy (≥1) + Provenance when `kind=public`  |

v0.1-core/catalog/market remain valid for unmigrated files. Writers emit 0.2.

---

## 8. How an agent uses this

1. Load the public contract (URL, git path, or catalog API).
2. Compile a **short** system projection: who + intent + priorities + speech + refusals + samples + laws + **policy** + **success**.
3. Do **not** paste private soul.
4. On conflict: higher `priorities` win; `refusals` and `policy` hard lines always win.

Contract = constitution. Soul = life under it.

---

## 9. Related SoRs

| Doc                       | Owns                                      |
| ------------------------- | ----------------------------------------- |
| **PERSONA.md** (this)     | Public contract schema & embodiment rules |
| **PERSONA-AGENT-CARD.md** | Mapping to A2A-shaped discovery cards     |
| `DESIGN.md`               | UI                                        |
| `07-growth.md`            | Private remember → promote                |
| D-018 / D-019 / D-048     | Layer split + this file as SoR + v0.2     |

**getPersona.md owns this format.**  
Implementations must not invent a second public persona schema without bumping `schemaVersion` here.
