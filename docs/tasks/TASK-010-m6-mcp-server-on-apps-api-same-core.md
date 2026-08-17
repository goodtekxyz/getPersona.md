# TASK-010: M6: MCP server on apps/api same core

## Status

In Progress

## Goal

M6: MCP server on apps/api same core

## Scope

- Deliver the goal above in a single focused pass.

## Out of Scope

- Unrelated refactors and features outside this slice.

## Acceptance Criteria

1. Goal and Scope are met and verifiable via Test Plan.
2. Result and Test Result are filled before `vibeops task ship`.

## Test Plan

- Project-specific checks for this change

## Git Context

- Base Branch: `develop`
- Base Commit: `9013aa5`
- Task Branch: `task/010-m6-mcp-server-on-apps-api-same-core`
- Started At: `2026-08-17T03:28:13.608Z`

## Result

- Added `@modelcontextprotocol/sdk` (~1.30) + `zod` to `apps/api`.
- `apps/api/src/mcp`: Streamable HTTP at `POST /mcp` (stateless, JSON responses).
- Auth: Bearer API key only (write scope); session cookies rejected for MCP.
- Tools → same Nest services as REST: `list_personas`, `get_persona`, `write`, `remember`.
- Rate limit middleware covers `/mcp` as well as `/v1`.
- Connect docs: `docs/project/04-api.md` (MCP section + Cursor `mcp.json` examples); D-017; `03-architecture` / `05-current-state` updated.

## Test Result

- `pnpm turbo run build typecheck test` — pass (all packages).
- Unit: `mcp-result.spec.ts` (error/json mapping); `mcp.server.factory.spec.ts` (InMemoryTransport client lists tools + `list_personas` calls `PersonasService.listOwned`).
