# Current state

> Facts only.

## Stage

- TASK-001–003 **Shipped**.
- TASK-004 (M0 design lock + scaffold) **In Progress**.
- Monorepo scaffold present: `apps/web`, `apps/api`, `packages/shared`.

## Product / stack

Docs `01`–`10` + `DESIGN.md` / `LAYOUT.md` / `UX.md`. Plan: [10-dev-plan.md](10-dev-plan.md).

## Active TASK

- `TASK-004` · M0 · In Progress

## Built

| Area     | State                                                  |
| -------- | ------------------------------------------------------ |
| UI SoR   | DESIGN / LAYOUT / UX locked (getdesign.app bench)      |
| Monorepo | pnpm 11 + turbo; Next 16.3; Nest 11.2                  |
| Compose  | Postgres 17 + Redis (`compose.yaml`)                   |
| CI       | `docs/ci/github-actions-ci.yml` (self-hosted skeleton) |

## Next step

Ship TASK-004 → M1 Better Auth.
