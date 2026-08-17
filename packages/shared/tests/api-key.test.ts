import assert from 'node:assert/strict';
import test from 'node:test';
import { createApiKeySchema } from '../src/api-key.js';

test('createApiKeySchema defaults to write scope', () => {
  const parsed = createApiKeySchema.parse({ name: 'ci' });
  assert.deepEqual(parsed.scopes, ['write']);
});

test('createApiKeySchema accepts write+promote', () => {
  const parsed = createApiKeySchema.parse({ name: 'ops', scopes: ['write', 'promote'] });
  assert.deepEqual(parsed.scopes, ['write', 'promote']);
});

test('createApiKeySchema rejects empty scopes', () => {
  assert.throws(() => createApiKeySchema.parse({ name: 'x', scopes: [] }));
});
