import assert from 'node:assert/strict';
import test from 'node:test';
import { rememberSchema, promoteSchema, projectSchema, requiresPromoteGate } from '../src/growth';

test('rememberSchema requires source key + candidate', () => {
  const parsed = rememberSchema.parse({
    personaId: 'p1',
    sourceKind: 'run',
    sourceId: 'r1',
    summary: 'note',
    candidate: { kind: 'fact', payload: { text: 'x' } },
  });
  assert.equal(parsed.candidate.kind, 'fact');
});

test('requiresPromoteGate for contract kinds only', () => {
  assert.equal(requiresPromoteGate('fact'), false);
  assert.equal(requiresPromoteGate('identity'), true);
  assert.equal(requiresPromoteGate('voice'), true);
  assert.equal(requiresPromoteGate('boundary'), true);
});

test('promoteSchema accepts confirmGate', () => {
  const parsed = promoteSchema.parse({ candidateId: 'c1', confirmGate: true });
  assert.equal(parsed.confirmGate, true);
});

test('projectSchema defaults kind enum', () => {
  assert.throws(() => projectSchema.parse({ personaId: 'p1', kind: 'tweet' }));
  const ok = projectSchema.parse({ personaId: 'p1', kind: 'post' });
  assert.equal(ok.kind, 'post');
});
