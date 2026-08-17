import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { Actor } from '../auth/actor-types.js';
import { requireScope } from '../auth/actor-types.js';

/**
 * Promote requires promote scope on the API key (or session operator).
 * Replaces env PROMOTE_CREDENTIAL (D-007 / M5 hashed keys).
 */
export function requirePromoteAccess(actor: Actor): void {
  requireScope(actor, 'promote');
}

/** @deprecated Prefer requirePromoteAccess(actor) — kept for test migration clarity. */
export function assertPromoteAllowed(actor: Actor | null | undefined): void {
  if (!actor) {
    throw new UnauthorizedException('Promote credential required.');
  }
  try {
    requirePromoteAccess(actor);
  } catch (err) {
    if (err instanceof ForbiddenException) throw err;
    throw err;
  }
}
