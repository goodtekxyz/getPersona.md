[한국어](README.ko.md) | [English](README.md)

# getPersona.md

> ⭐ **If this helps your agents, please star the repo** — it helps others find it.
> [Star on GitHub](https://github.com/goodtekxyz/getPersona.md)

Give your AI agent a persona.

**Product:** [getpersona.md/en](https://getpersona.md/en)

## What this is

**PERSONA.md** is a one-page guide that makes an AI agent read, speak, and act as a persona.

- **Your voice** — put one persona on an agent so it speaks the way you want
- **Group personas** — give each role its own persona so a crew works as a team

On [getpersona.md/en](https://getpersona.md/en), pick a persona, copy **Apply**, and paste it into ChatGPT, Claude, or Cursor. No account needed to apply.

## How to apply

1. Open [getpersona.md/en](https://getpersona.md/en) and pick a persona.
2. Optional: try a short chat on the site.
3. Copy **Apply** into ChatGPT, Claude, or Cursor.
4. That agent reads the persona and works in that voice.

## After you apply

The agent follows that persona’s tone, priorities, and limits. If it drifts, paste Apply again in a new chat.

## Add a personal persona

1. Open [Submit](https://getpersona.md/en/personas/submit).
2. Prefer **Open issue**, or create a file / pull request if you know GitHub.
3. After review or merge, it appears in the catalog.

Do not put legal names, contacts, or private facts in the file.

## What’s in this repository

```
user/      personal personas
public/    public figures
roles/     role / group personas
```

Listed crews: [vibe-coding](./roles/vibe-coding/) · [blog-author](./roles/blog-author/)

## For developers (optional)

```bash
git clone --filter=blob:none --sparse https://github.com/goodtekxyz/getPersona.md.git
cd getPersona.md
git sparse-checkout set roles/vibe-coding/developer
cat roles/vibe-coding/developer/PERSONA.md
```

Most people only need Apply on the site.

## Made by goodtek.

Same family of products and community:

- [goodtek](https://goodtek.xyz) — company hub
- [llms](https://llms.goodtek.xyz) — multi-LLM routing
- [vibePulse](https://vibepulse.goodtek.xyz) — uptime monitoring
- [VibeCrew](https://vibecrew.kr) — Korean vibe-coding builder community
