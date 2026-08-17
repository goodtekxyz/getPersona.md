import assert from 'node:assert/strict';
import test from 'node:test';
import { writeSchema, writeResultSchema, DEFAULT_WRITE_MAX_LENGTH } from '../src/write';

test('writeSchema accepts post with source + constraints', () => {
  const parsed = writeSchema.parse({
    personaId: 'p1',
    kind: 'post',
    source: { brief: 'ship note', text: 'we shipped M3' },
    constraints: { maxLength: 200 },
  });
  assert.equal(parsed.kind, 'post');
  assert.equal(parsed.constraints?.maxLength, 200);
});

test('writeSchema rejects unknown kind', () => {
  assert.throws(() => writeSchema.parse({ personaId: 'p1', kind: 'tweet' }));
});

test('writeResultSchema text|skip', () => {
  const text = writeResultSchema.parse({
    status: 'text',
    text: 'hello',
    runId: 'r1',
    memoryUsed: ['m1'],
  });
  assert.equal(text.status, 'text');
  const skip = writeResultSchema.parse({
    status: 'skip',
    reason: 'over_length',
    runId: 'r2',
    memoryUsed: [],
  });
  assert.equal(skip.status, 'skip');
  assert.equal(DEFAULT_WRITE_MAX_LENGTH, 280);
});
