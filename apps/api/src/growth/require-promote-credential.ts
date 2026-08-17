import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

/** Header carrying the promote credential (separate from write/session auth). */
export const PROMOTE_CREDENTIAL_HEADER = 'x-promote-credential';

/**
 * Promote must use a dedicated credential — session/write alone is not enough (D-007).
 * Configure via PROMOTE_CREDENTIAL env (M5 will swap for hashed API keys).
 */
export function requirePromoteCredential(req: Request): void {
  const expected = process.env.PROMOTE_CREDENTIAL?.trim();
  if (!expected) {
    throw new ForbiddenException('Promote credential is not configured.');
  }
  const provided = req.header(PROMOTE_CREDENTIAL_HEADER)?.trim();
  if (!provided) {
    throw new UnauthorizedException('Promote credential required.');
  }
  if (provided !== expected) {
    throw new ForbiddenException('Invalid promote credential.');
  }
}
