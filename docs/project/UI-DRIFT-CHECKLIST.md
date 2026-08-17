# DESIGN / LAYOUT / UX drift checklist

> M8 quality harden. UI SoR remains `DESIGN.md` · `LAYOUT.md` · `UX.md` (M0a, getDesign.md bench).  
> Run this before shipping web UI changes. Fail = drift from locked docs.

## DESIGN.md

- [ ] Dark canvas (`--background` / surfaces) — no cream/light default theme
- [ ] Accent is lime (`--accent` / `--accent-dim`) — not purple/indigo gradient defaults
- [ ] Typography follows locked tokens — no Inter/Roboto/Arial/system as primary UI font
- [ ] Brand **getPersona.md** is hero-level on branded first viewport (not nav-only)
- [ ] No glow stacks, emoji decoration, or multi-layer shadow kits not in DESIGN

## LAYOUT.md

- [ ] First viewport reads as one composition (not a dashboard of widgets)
- [ ] Hero is full-bleed / edge-to-edge when LAYOUT requires it — no inset hero cards by default
- [ ] Shell (nav/footer) matches LAYOUT breakpoints and spacing rails
- [ ] One job per section — no packed promo/stat strips in the hero budget

## UX.md

- [ ] Auth / empty / error copy tone matches UX.md (no corporate slogan voice)
- [ ] Permission and ownership failures stay clear and non-leaky (no internal stack dumps)
- [ ] Sync / agent states do not overclaim (stub sync stays honest if product copy mentions it)

## How to use

1. Diff web changes against the three SoR files.
2. Check every box or open a follow-up TASK for intentional SoR edits (do not silently drift).
3. Visual pixel-perfect parity with getdesign.app is **not** required; **token and rule compliance** is.
