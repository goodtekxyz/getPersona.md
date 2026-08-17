# DESIGN.md

> UI SoR — visual design. Benchmark: [getdesign.app/design](https://www.getdesign.app/design) (getDesign.md product).  
> Product: **getPersona.md**. Do not invent a second palette.

## Benchmark

| Source                           | Role                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| https://www.getdesign.app        | Living design system (dark canvas, lime accent, hairline borders) |
| https://www.getdesign.app/design | Token & component reference                                       |

getPersona.md **owns** this file. getdesign is not a runtime dependency.

## Logo / brand

- Product name **getPersona.md** is the hero-level brand signal (not nav-only).
- Wordmark: split or mono treatment allowed; mark + wordmark on primary surfaces.
- Do not recolor brand marks with arbitrary hues; inherit `currentColor` or locked tokens.
- Clear space ≥ mark height on all sides.

## Palette (CSS variables)

Dark-first (benchmark). Light mode is out of MVP.

| Token             | Value                    | Use            |
| ----------------- | ------------------------ | -------------- |
| `--background`    | `#0a0a0b`                | Page canvas    |
| `--surface-100`   | `#101012`                | Cards, tiles   |
| `--surface-200`   | `#141418`                | Hover, inputs  |
| `--surface-300`   | `#1a1a20`                | Elevated       |
| `--foreground`    | `#ededee`                | Primary text   |
| `--muted`         | `rgba(237,237,238,0.6)`  | Body           |
| `--subtle`        | `rgba(237,237,238,0.38)` | Meta, labels   |
| `--faint`         | `rgba(237,237,238,0.12)` | Dashed rails   |
| `--border`        | `rgba(255,255,255,0.07)` | Hairlines      |
| `--border-strong` | `rgba(255,255,255,0.14)` | Focus, chips   |
| `--accent`        | `#a3e635`                | Primary accent |
| `--accent-dim`    | `#65a30d`                | Accent pressed |
| `--accent-glow`   | `rgba(163,230,53,0.18)`  | Halos          |
| `--danger`        | `#f87171`                | Errors only    |

## Typography

| Role            | Spec                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Display font    | **Syne** (or equivalent geometric display — not Inter/Roboto/Arial/system UI) |
| Body font       | **DM Sans**                                                                   |
| Mono            | **JetBrains Mono**, `font-variant-numeric: tabular-nums`                      |
| `.display-hero` | `clamp(36px, 6vw, 64px)` / 1.04 / -0.035em / 500                              |
| `.display-md`   | `clamp(22px, 2.8vw, 32px)` / 1.15 / -0.025em / 500                            |
| `body`          | 14.5px / 1.6 / -0.005em / 400                                                 |
| `.eyebrow`      | 12px / 1.4 / muted                                                            |

## Spacing & radius

- Base unit **4px**. Scale: 2, 4, 6, 8, 12, 16, 24, 32, 48, 64.
- Radius: `sm` 6px · `md` 10px · `lg` 14px · `xl` 20px · `full` 9999px.
- Prefer hairlines over heavy cards; avoid multi-layer shadows and glow stacks except `--accent-glow` sparingly.

## Components (visual)

- **Button primary** — foreground on surface-300 or inverted; clear focus ring `--border-strong`.
- **Button accent** — `--accent` fill, dark text; pressed `--accent-dim`.
- **Button ghost** — transparent, border hairline.
- **Input compact** — `--surface-200`, hairline border, strong border on focus.
- **Chip** — status / meta; subtle border.
- **Nav link active** — accent or strong foreground; others muted.
- **Dashed rail** — `--faint` dashed frame for code / agent panes.
- **Code token** — mono on surface-100.

No pill-cluster marketing strips. No purple-on-white theme. No cream/terracotta broadsheet look.

## Motion

| Name       | Easing                                  | Use                        |
| ---------- | --------------------------------------- | -------------------------- |
| `standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` ~220ms | UI, nav, hover             |
| `draw-on`  | same, ~520ms stagger 80ms               | Brand / hero enter         |
| `pulse`    | ease-in-out 1.4s                        | Status dots opacity 1→0.35 |

Ship 2–3 intentional motions on marketing surfaces; no noise.

## Voice (visual copy adjacent)

See `UX.md`. Visual hierarchy: brand > one headline > one support line > one CTA group > one dominant visual plane.
