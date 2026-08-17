import { createHash } from 'node:crypto';
import { ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { extractBearerToken, hashApiKey, requireScope, type Actor } from './actor-types.js';

describe('actor-types helpers', () => {
  function reqWithAuth(authorization?: string): Request {
    return {
      header: (name: string) =>
        name.toLowerCase() === 'authorization' ? authorization : undefined,
      headers: {},
    } as unknown as Request;
  }

  it('hashes API keys with sha256 hex', () => {
    expect(hashApiKey('secret')).toMatch(/^[a-f0-9]{64}$/);
    expect(hashApiKey('secret')).toBe(createHash('sha256').update('secret', 'utf8').digest('hex'));
    expect(hashApiKey('a')).not.toBe(hashApiKey('b'));
  });

  it('extracts Bearer token', () => {
    expect(extractBearerToken(reqWithAuth('Bearer abc'))).toBe('abc');
    expect(extractBearerToken(reqWithAuth())).toBeNull();
  });

  it('requireScope enforces write vs promote', () => {
    const writeOnly: Actor = {
      userId: 'u1',
      authType: 'api_key',
      scopes: new Set(['write']),
      apiKeyId: 'k1',
    };
    expect(() => requireScope(writeOnly, 'write')).not.toThrow();
    expect(() => requireScope(writeOnly, 'promote')).toThrow(ForbiddenException);

    const both: Actor = {
      userId: 'u1',
      authType: 'api_key',
      scopes: new Set(['write', 'promote']),
      apiKeyId: 'k2',
    };
    expect(() => requireScope(both, 'promote')).not.toThrow();
  });
});
