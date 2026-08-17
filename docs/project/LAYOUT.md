# LAYOUT.md

> UI SoR — structure & layout. Benchmark shell: getdesign.app (dark full-bleed, one composition).  
> Product hosts: `getpersona.md` (web).

## Breakpoints

| Name | Min width |
| ---- | --------- |
| `sm` | 640px     |
| `md` | 768px     |
| `lg` | 1024px    |
| `xl` | 1280px    |

Content max width: **1120px** centered. Gutter: 16px (`sm`+ 24px).

## Shell

```text
┌──────────────────────────────────────────┐
│  top nav: brand (left) · links · CTA     │  hairline bottom
├──────────────────────────────────────────┤
│                                          │
│  main (full-bleed hero OR app canvas)    │
│                                          │
├──────────────────────────────────────────┐
│  footer: legal · lang · product links    │  muted
└──────────────────────────────────────────┘
```

- Nav height ~56–64px. Brand is readable at a glance; not an icon-only mark on first paint.
- Footer is quiet; no promo cards.

## Marketing / landing (first viewport)

One composition (not a dashboard):

1. Brand (hero-level)
2. One headline
3. One short supporting sentence
4. One CTA group
5. One dominant edge-to-edge visual plane (atmosphere or product context)

Do **not** put in the first viewport: stats strips, schedule blocks, address stacks, multi-card collages, floating badges on hero media.

## App layouts (post-auth)

| Area            | Layout                                                              |
| --------------- | ------------------------------------------------------------------- |
| Persona list    | Single column list or quiet table; no card grid for browsing        |
| Persona detail  | Two-pane on `lg+`: contract form \| preview/trace; stacked on small |
| Agent / run     | Main column + optional dashed-rail side for trace                   |
| Settings / keys | Narrow form column (max ~480px)                                     |

## Auth pages

Centered column max ~400px on `--background`. No decorative card chrome beyond surface-100 if needed for contrast. Link to terms/privacy below fold of the form.

## Agent / API docs surfaces (web)

If linked from product: same shell; content in readable prose + code rails. Do not invent a second visual language.

## Grid rules

- Prefer single-purpose sections: one headline + one support line.
- Dashed rails for code / agent output only.
- Avoid nested cards; if removing border/shadow/radius does not hurt comprehension, remove it.
