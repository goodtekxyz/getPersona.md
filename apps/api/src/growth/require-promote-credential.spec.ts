import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { Actor } from '../auth/actor-types.js';
import { assertPromoteAllowed, requirePromoteAccess } from './require-promote-credential.js';

describe('requirePromoteAccess', () => {
  function actor(
    scopes: Array<'write' | 'promote'>,
    authType: Actor['authType'] = 'api_key',
  ): Actor {
    return {
      userId: 'u1',
      authType,
      scopes: new Set(scopes),
      apiKeyId: authType === 'api_key' ? 'k1' : undefined,
    };
  }

  it('rejects write-only API key', () => {
    expect(() => requirePromoteAccess(actor(['write']))).toThrow(ForbiddenException);
  });

  it('accepts promote-scoped API key', () => {
    expect(() => requirePromoteAccess(actor(['promote']))).not.toThrow();
  });

  it('accepts session operator (write+promote)', () => {
    expect(() => requirePromoteAccess(actor(['write', 'promote'], 'session'))).not.toThrow();
  });

  it('assertPromoteAllowed rejects missing actor', () => {
    expect(() => assertPromoteAllowed(null)).toThrow(UnauthorizedException);
  });
});
