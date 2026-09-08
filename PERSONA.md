# PERSONA.md

> **Official public persona contract (v0.1)**  
> Only **public** data. Private soul never belongs here.  
> Korean explanation: [PERSONA.ko.md](./PERSONA.ko.md) — same schema, not a second format.

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

If a field cannot change an agent’s next token under conflict, it does not belong in the required set.

---

## 1. One sentence

**PERSONA** is a portable, public contract an agent can load to inhabit a voice — without private memory.

---

## 2. Layers (D-018)

| Layer               | Artifact                      | Visibility      | Contains                                                       |
| ------------------- | ----------------------------- | --------------- | -------------------------------------------------------------- |
| **Public contract** | `PERSONA.md` + `persona.json` | Always public   | Identity, purpose, speech rules, priorities, samples, refusals |
| **Private soul**    | Platform only                 | Account-private | Relationships, experience, remember → promote                  |

Age, family, biography may appear **only if the author chooses to publish them**.  
Diaries, DMs, medical/financial secrets, trust graphs, LTM dumps — **never** in this file.

---

## 3. Design principles

1. **Public by construction** — anything in the file is shareable, forkable, indexable.
2. **Embodiment over aesthetics** — fields must steer behavior, not decorate a card.
3. **Examples > adjectives** — prefer sample lines and concrete habits.
4. **Priorities > “stance”** — ordered values beat mood labels.
5. **Refusals are hard** — soft preferences go in habits; hard stops go in refusals.
6. **Additive evolution** — `schemaVersion` bumps; never relocate soul data into the contract.
7. **One format** — famous showcase and user-published personas use the same schema.
8. **Interview compiles the file** — humans speak; the agent writes v0.1 JSON; humans confirm or reject lines.

### Spec language vs voice language

- This file is the sole schema (English).
- `PERSONA.ko.md` is the same spec in Korean for humans. Not a second `schemaVersion`.
- A persona contract is written in `identity.language` only. Do not ship bilingual samples.

### Authoring (D-021) — interview, not a form

A human does not type `habits`, `samples`, or `priorities` into a form.  
An interviewer asks; a compiler writes v0.1 JSON; the human only **confirms or rejects** compiled lines.  
The interview transcript is **not** part of the contract.

Interview language = the conversation language.  
`identity.language` = the voice’s language. They may differ.

1. **Frame** — What does this voice do in public? Who is speaking? Which language does the voice use?
2. **Speak** — Three in-character replies, different speech acts (assert / decline / invite, or observe / question / cut). Those replies are sample candidates.
3. **Conflict** — When two goods collide, which wins? → ordered `priorities`.
4. **Hard no** — What must this voice never say or claim? → `refusals`.
5. **Confirm** — Show compiled `persona.json`. Infer `register` / `length` / `person` from the samples. Do not ask the human to fill blanks.

Do not ask “list three habits” or “what is your tone?”. Habits are extracted from how they spoke, then linted with §4.3–4.5.

### Rejected as required fields

| Tempting field                       | Why rejected                                           |
| ------------------------------------ | ------------------------------------------------------ |
| Free-text **tone adjectives**          | Weak signal; collapses to stereotype                   |
| Free-text **MBTI / Big Five / traits** | Pseudopsychology; poor agent control                   |
| **System prompt** blob                 | Opaque, non-portable, invites private leakage          |
| **Memory / RAG hooks**                 | Soul layer — not public                                |
| **Tool allow-lists**                   | Runtime/product concern; not the public voice contract |
| **Private relationships**              | Soul layer                                             |
| **Catchphrase-only samples**           | Model already overfits; voice collapses under pressure |
| **Per-kind sample maps / Q–A pairs**   | Extra structure; the model follows the form            |
| **Negative-sample field**              | Model echoes the banned voice; use a habit instead     |
| **Hand-filled habit / sample forms**   | Humans are bad compilers; interview, then confirm      |

---

## 4. Required fields (v0.1)

### 4.1 Meta

| Field           | Type              | Why                                                                 |
| --------------- | ----------------- | ------------------------------------------------------------------- |
| `schemaVersion` | `"0.1"`           | Conformance                                                         |
| `slug`          | kebab-case string | Stable id                                                           |
| `name`          | string            | Display name                                                        |
| `summary`       | string ≤ 200      | One-line public pitch (catalog cards)                               |
| `license`       | string            | Reuse rules (marketplace-ready), e.g. `CC-BY-4.0`, `CC0-1.0`, `ARR` |

### 4.2 Identity

| Field               | Type           | Why                                           |
| ------------------- | -------------- | --------------------------------------------- |
| `identity.who`      | string         | Public framing of who is speaking             |
| `identity.intent`   | string         | Purpose when speaking — the job of this voice |
| `identity.language` | BCP-47-ish tag | `ko`, `en`, …                                 |

`who` is not a legal identity claim. It is the **role the agent performs in public**.

### 4.3 Speech (constraints, not vibes)

| Field             | Type                                             | Why                                                                  |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `speech.register` | `formal` \| `neutral` \| `casual`                | Closed enum — measurable                                             |
| `speech.length`   | `terse` \| `short` \| `medium` \| `long`         | Closed enum                                                          |
| `speech.person`   | `first` \| `first_plural` \| `second` \| `third` | Pronoun default                                                      |
| `speech.habits`   | 1–5 strings                                      | **Concrete** rules (“One idea per sentence”, “No corporate buzzwords”) |

Habits must be testable instructions.  
Bad: `witty`. Good: `Do not explain the joke`.

One constraint per habit. Do not restate a `priority` as a habit — habits steer the mouth; priorities settle conflicts.

### 4.4 Priorities

| Field        | Type                     | Why                           |
| ------------ | ------------------------ | ----------------------------- |
| `priorities` | 2–7 strings, **ordered** | What wins when goals conflict |

This replaces vague “stance”.  
Example: `Clarity over jargon`, `The team before the self`.

### 4.5 Samples

| Field     | Type        | Why                                |
| --------- | ----------- | ---------------------------------- |
| `samples` | 2–5 strings | Strongest few-shot signal for LLMs |

Samples should sound like the persona **already speaking**, not describe the persona.

Writing rules (no extra keys):

- An utterance, not a bio line and not a famous catchphrase the model already knows.
- Catalog bar: **≥3 samples** covering **≥2 speech acts** (assert, decline, question, observe, invite, cut).
- Do not add kind-tagged maps or prompt–response pairs. Flat strings only.

### 4.6 Refusals

| Field      | Type         | Why                    |
| ---------- | ------------ | ---------------------- |
| `refusals` | 1–12 strings | Hard public boundaries |

Not preferences. Violating a refusal means the agent is out of contract.

---

## 5. Optional (public by choice)

| Field                  | Type            | Notes                                                                    |
| ---------------------- | --------------- | ------------------------------------------------------------------------ |
| `tags`                 | string[]        | Discovery                                                                |
| `links`                | url[]           | Public sites only                                                        |
| `publicFacts`          | string[] or map | Age band, hometown, job title, family — **only if intentionally public** |
| `attribution`          | string          | Provenance (“inspired by public talks…”, author credit)                  |
| `repoUrl` / `cloneUrl` | url             | Distribution envelope (catalog / git)                                    |

---

## 6. Canonical `persona.json` (v0.1)

```json
{
  "schemaVersion": "0.1",
  "slug": "jobs-keynote",
  "name": "Jobs · Keynote",
  "summary": "Short keynote cadence. One idea per line.",
  "license": "CC-BY-4.0",
  "tags": ["keynote", "product"],
  "identity": {
    "who": "A product storyteller writing in a keynote cadence inspired by Steve Jobs’ public talks",
    "intent": "Make the product feel inevitable in the fewest words",
    "language": "en"
  },
  "speech": {
    "register": "neutral",
    "length": "terse",
    "person": "first_plural",
    "habits": [
      "One idea per sentence",
      "Prefer white space over filler",
      "Show the thing, then name it"
    ]
  },
  "priorities": [
    "Clarity over jargon",
    "Inevitability over features lists",
    "Calm certainty over hype adjectives"
  ],
  "samples": [
    "There is one button. That is the point.",
    "We cut the other six ideas. They were features, not the thing.",
    "If we have to explain it, we are not done."
  ],
  "refusals": [
    "Do not claim to be Steve Jobs",
    "Do not invent private quotes or biographies",
    "Do not use corporate buzzwords (synergy, leverage)"
  ],
  "attribution": "Inspired by publicly available keynotes and talks.",
  "repoUrl": "https://github.com/goodtekxyz/getPersona.md/tree/main/jobs-keynote",
  "cloneUrl": "https://github.com/goodtekxyz/getPersona.md.git"
}
```

### Human twin (`PERSONA.md`)

Same sections, readable in git. When both exist, **JSON wins** for machines.

```markdown
# {name}

{summary}

## Who

## Intent

## Language

## Speech

## Priorities

## Samples

## Refusals

## Public facts (optional)

## Attribution (optional)
```

---

## 7. Conformance

| Level           | Meaning                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------- |
| **0.1-core**    | All required fields present; enums valid; ≥2 samples; ≥2 priorities; ≥1 refusal; ≥1 habit |
| **0.1-catalog** | core + `repoUrl` + ≥3 samples spanning ≥2 speech acts                                     |
| **0.1-market**  | catalog + explicit `license` + `attribution`                                              |

Validators should reject adjective-only `habits` / `priorities` when they match a denylist of vibe words (`warm`, `nice`, `cool`, `friendly` alone, etc.) — prefer lint warnings in v0.1, hard fail later.

---

## 8. How an agent uses this

1. Load the public contract (URL, git path, or catalog API).
2. Compile a **short** system projection: who + intent + priorities + speech enums/habits + refusals + samples.
3. Do **not** paste private soul. If soul is linked for this account, retrieve gated memory separately.
4. On conflict: higher `priorities` win; `refusals` always win.

Contract = constitution. Soul = life under it.

---

## 9. Product loop on this format

```text
Interview (speak) → compile v0.1 → human confirms
  → showcase or publish PERSONA (same schema, public)
  → star · checkout · use (agents read the file)
  → popularity / usage
  → marketplace (license + attribution matter)
```

Soul (remember → promote) starts after the contract exists. The interview is not a memory dump.

---

## 10. Related SoRs

| Doc                   | Owns                                      |
| --------------------- | ----------------------------------------- |
| **PERSONA.md** (this) | Public contract schema & embodiment rules |
| `DESIGN.md`           | UI                                        |
| `07-growth.md`        | Private remember → promote                |
| D-018 / D-019 / D-021 | Layer split + this file as SoR + interview |

**getPersona.md owns this format.**  
Implementations must not invent a second public persona schema without bumping `schemaVersion` here.
