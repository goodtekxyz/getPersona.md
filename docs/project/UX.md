# UX.md

> UI SoR — flows, states, copy. Benchmark patterns: getDesign.md product (join/waitlist, docs, clear verbs).  
> Auth/legal/OAuth patterns follow getDesign.md; details confirmed against live site during M1.

## Principles

1. **Persona is the object** — flows speak about “your persona”, not “the model”.
2. **Skip is success** — agent may return skip; UI treats it as a valid outcome, not a failure toast spam.
3. **Default private** — public access is opt-in and explicit.
4. **Short verbs** — Paste / Register / Sync / Fork / Run / Promote. No slogan soup.
5. **Account owns personas** — never imply cross-account edit.

## Voice (Do / Don’t)

| Do                                               | Don’t                                       |
| ------------------------------------------------ | ------------------------------------------- |
| Personas you can register, sync, and write with. | Revolutionary AI-powered identity platform. |
| Run post, comment, or reply — or skip.           | Unlock seamless multi-channel engagement.   |
| Connect with API or MCP.                         | Robust enterprise-grade connectivity suite. |
| Grounded in your persona contract.               | Leveraging cutting-edge LLM orchestration.  |

Languages: **ko** and **en** (next-intl). Match tone; do not machine-translate idioms blindly.

## Core flows

### Sign up / sign in

1. Land → CTA → sign up.
2. Email (+ OAuth if enabled per getDesign.md parity).
3. Mail verify if required (SMTP); same policy as getDesign.md.
4. Terms/privacy consent before submit (pages exist; pattern from getDesign.md).
5. Land in persona list (empty state if none).

### Register persona

1. Name + minimal identity / voice / boundaries.
2. Success → detail view; subsequent API uses `persona_id` only.

### Sync (MVP: job + stub)

1. Enter source handles (blog / X / Threads).
2. Enqueue job; show status (queued / running / done / failed).
3. Copy: stub adapters may not fetch yet — honest empty/partial states.

### Fork

1. From a **public** persona.
2. Confirm public fields only; create owned copy.

### Write (agent)

1. Choose persona (owned) + kind (post/comment/reply) + brief/source.
2. Result: **text** or **skip** with reason.
3. Show memory_used / run_id in a dashed rail (debug/audit), collapsed by default.

### Promote

1. List candidates.
2. Promote requires promote credential / gate — clear error if write-only key.

### API keys

1. Create key → show **once**.
2. Store hash only; UI never re-displays secret.

## Empty / error / permission

| State                    | Behavior                                         |
| ------------------------ | ------------------------------------------------ |
| Empty persona list       | One CTA: Register persona. No fake sample cards. |
| Skip result              | Neutral banner: “Skipped — {reason}”.            |
| 403 other user's persona | “You don’t have access to this persona.”         |
| Rate limited             | “Too many requests — try again shortly.”         |
| Network / 5xx            | Retry once; then show error with run_id if any.  |

## Accessibility

- Focus visible (`--border-strong`).
- Do not rely on accent color alone for state.
- Auth forms: labels, autocomplete attributes, error text tied to fields.

## Out of UX (now)

- Admin console (`admin.getpersona.md`).
- Payments.
- Live social publish buttons as core (clients may publish elsewhere).
