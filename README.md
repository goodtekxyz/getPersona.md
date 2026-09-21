[한국어](README.ko.md) | [English](README.md)

# getPersona.md

Browse personas on the product site, try a short chat, then apply them in the AI tools you already use.

**Product:** [getpersona.md/en](https://getpersona.md/en)

## What this is

A persona is a short guide that tells an AI how to speak in this chat: who it is, what it protects, and where it draws the line.

Each persona lives in this GitHub repository as one file. On [getpersona.md/en](https://getpersona.md/en) you can browse those voices and try a short chat (about three turns). To keep the voice in ChatGPT, Claude, or Cursor, copy the **apply text** from the site and paste it into that tool. The tool then loads the persona from here and keeps answering in that voice.

- **You do not need an account to apply.**
- Sign up only if you want to save personas on the site.
- Building a personal persona that speaks like you is still on a waitlist on the product site.

## How to apply

1. Open [getpersona.md/en](https://getpersona.md/en) and pick a persona.
2. Optional: try a short chat on the site.
3. On the persona page, copy the **apply text**.
4. Paste it into ChatGPT, Claude, or Cursor.
5. That AI loads the persona and speaks in that voice.

You do not need to download files by hand for everyday use.

## After you apply

The AI you pasted into should follow that persona’s tone, priorities, and limits—not a generic assistant style. If the voice drifts, paste the apply text again in a new chat.

## Add a personal persona (issue / pull request)

Anyone can propose a personal persona for the public list. If you are new to GitHub, use the buttons on the site:

1. Open [Submit a personal persona](https://getpersona.md/en/personas/submit).
2. **Easiest:** choose **Open issue**. GitHub opens with a draft already filled in. After review, maintainers add it under `user/<your-name>/`.
3. **If you know GitHub:** create the file / open a pull request (you may need to fork first). After merge, it appears in the catalog.

Do not put legal names, phone numbers, emails, or private facts in the file.

## What’s in this repository

```
user/      personal personas people have shared
public/    public figures
roles/     job roles, grouped by crew
```

Each voice is one folder with one description file (`PERSONA.md`).

Crews listed on the product landing:

1. **[vibe-coding](./roles/vibe-coding/)** — Vibe Crew · apply on site: `/personas/apply/vibe-coding`
2. **[blog-author](./roles/blog-author/)** — Blog author · `/personas/apply/blog-author`

## For developers (optional)

If you want only one folder on disk:

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-coding/developer
cat roles/vibe-coding/developer/PERSONA.md
```

Most people can skip this and use the apply text on [getpersona.md/en](https://getpersona.md/en) instead.
