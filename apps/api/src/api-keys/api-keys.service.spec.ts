import { createHash } from 'node:crypto';
import { generateApiKeyPlaintext, serializeApiKey } from './api-keys.service.js';
import { hashApiKey } from '../auth/actor-types.js';
import type { ApiKeyEntity } from './api-key.entity.js';

describe('api keys', () => {
  it('generateApiKeyPlaintext uses gp_live_ prefix and never equals hash', () => {
    const { plaintext, prefix } = generateApiKeyPlaintext();
    expect(plaintext.startsWith('gp_live_')).toBe(true);
    expect(prefix).toBe(plaintext.slice(0, 16));
    expect(hashApiKey(plaintext)).toBe(
      createHash('sha256').update(plaintext, 'utf8').digest('hex'),
    );
    expect(hashApiKey(plaintext)).not.toBe(plaintext);
  });

  it('serializeApiKey never includes plaintext key or hash', () => {
    const entity = {
      id: 'k1',
      name: 'ci',
      keyPrefix: 'gp_live_abcd',
      keyHash: 'deadbeef',
      scopes: ['write'],
      revokedAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    } as ApiKeyEntity;
    const json = serializeApiKey(entity);
    expect(json).toEqual({
      id: 'k1',
      name: 'ci',
      keyPrefix: 'gp_live_abcd',
      scopes: ['write'],
      revokedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(JSON.stringify(json)).not.toContain('deadbeef');
    expect('key' in json).toBe(false);
    expect('keyHash' in json).toBe(false);
  });
});
