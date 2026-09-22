# blog-author crew — contract changelog

Content SemVer for role `PERSONA.md` files (`contractVersion`).

## 1.4.0 — 2026-09-22

- **`voice-tech-blogger-ko` 1.0.0:** Korean default = polite, concise, fact-first IT tech blogger (30s male archetype).
- **Defaults:** ko → `voice-tech-blogger-ko`, en → `voice-pg-essay`. `voice-kim-honbi-essay` remains available as an optional override.

## 1.3.0 — 2026-09-22

- **`voice-kim-honbi-essay` 1.1.0:** Korean default is **casual maker/intro blog**, not literary essay cosplay. Slug kept for D-085 / catalog compatibility.

## 1.2.0 — 2026-09-22

Style voices (D-085): still `kind: role` PERSONA.md — no new schema sections.

- **Voices:** `voice-pg-essay` (en), `voice-kim-honbi-essay` (ko) under `roles/blog-author/`.
- **Lead:** picks voice by post language (or user `voice-*` override) before author drafts.
- **Author:** dual-attaches author + voice; biography rules stay on author; prose cadence from voice.
- **Review:** scores drift against the selected voice file.
- **Shared:** `CrewDefinition.voices`, `pickCrewVoiceRole`, `crewPackRoles` include voices in apply-pack.

## 1.1.0 — 2026-09-17

Best-in-class PERSONA.md v0.2 rewrite for all Blog Author seats (lead, topic, outline, author, experience, review, media, polish) + Korean UI twins.

- **Priorities #1:** Accuracy of facts and voice over speed.
- **Lead:** does not write the post; routes topic → outline → author → experience → review → media → polish.
- **Author:** no invented biography; **experience:** notes only.
- **Laws / Refusals / Success / Samples:** expanded to v0.2 best bar (8–12 laws, 6–10 refusals, 2–4 success checks, 4–5 samples).
- **Contract:** each role `PERSONA.md` → `1.1.0` (2026-09-17).

## 1.0.0 — 2026-09-14

Roles: lead, topic, outline, author, experience, review, media, polish.

- **Crew:** Blog Author — owned-voice posts (topic → outline → author immersion → experience → review → media → polish).
- **Not Storydesk:** Storydesk is reported writing; this pack is personal/brand voice.
- **Laws:** Do not invent biography; experience only from brief/soul/user notes.
