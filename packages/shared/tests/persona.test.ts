import assert from 'node:assert/strict';
import test from 'node:test';
import { createPersonaSchema, patchPersonaSchema } from '../src/persona';

test('createPersonaSchema accepts minimal contract', () => {
  const parsed = createPersonaSchema.parse({
    displayName: 'Kai',
    identity: { who: 'builder', intent: 'ship', language: 'ko' },
    voice: { typing: 'short', stance: 'direct', sampleSentences: ['ship it'] },
  });
  assert.equal(parsed.permissions.visibility, 'private');
  assert.deepEqual(parsed.boundaries.doNotSay, []);
});

test('createPersonaSchema rejects more than 3 sample sentences', () => {
  assert.throws(() =>
    createPersonaSchema.parse({
      displayName: 'Kai',
      identity: { who: 'builder', intent: 'ship', language: 'ko' },
      voice: {
        typing: 'short',
        stance: 'direct',
        sampleSentences: ['a', 'b', 'c', 'd'],
      },
    }),
  );
});

test('patchPersonaSchema requires at least one field', () => {
  assert.throws(() => patchPersonaSchema.parse({}));
});
