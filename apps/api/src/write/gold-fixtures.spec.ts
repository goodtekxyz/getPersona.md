/**
 * Gold fixtures for write kinds (M8).
 *
 * Contract: assert pass *shape* (`status: text` + runId/memoryUsed/non-empty text)
 * or `status: skip` only. Never assert a golden answer sentence.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeResultSchema, type WriteResult } from '@getpersona/shared';
import { WriteService } from './write.service.js';
import { LlmWrapperClient } from './llm-wrapper.client.js';
import type { WriteRunEntity } from './write-run.entity.js';
import { writeLawCodes } from './physical-laws.js';

type GoldFixture = {
  id: string;
  kind: 'post' | 'comment' | 'reply';
  language?: string;
  source: Record<string, unknown>;
  expect: { status: 'text' | 'skip' };
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

function loadGoldFixtures(): GoldFixture[] {
  return readdirSync(fixturesDir)
    .filter((name) => name.startsWith('gold-') && name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as GoldFixture);
}

function assertPassOrSkipShape(result: WriteResult, expected: 'text' | 'skip') {
  const parsed = writeResultSchema.parse(result);
  expect(parsed.status).toBe(expected);
  expect(parsed.runId.length).toBeGreaterThan(0);
  expect(Array.isArray(parsed.memoryUsed)).toBe(true);

  if (expected === 'text') {
    expect(typeof parsed.text).toBe('string');
    expect((parsed.text ?? '').trim().length).toBeGreaterThan(0);
    // No golden answer: do not pin exact wording.
  } else {
    expect(parsed.reason).toBeTruthy();
  }
}

describe('gold fixtures (pass shape | skip only)', () => {
  const runs = new Map<string, WriteRunEntity>();

  const growth = {
    project: async (
      _actorUserId: string,
      raw: { personaId: string; kind: string; language?: string },
    ) => ({
      personaId: raw.personaId,
      kind: raw.kind,
      channel: null,
      language: raw.language ?? 'en',
      contract: {
        identity: { who: 'a', intent: 'ship', language: raw.language ?? 'en' },
        voice: { typing: 'short', stance: 'direct', sampleSentences: ['hi'] },
        boundaries: { doNotSay: [] },
        permissions: { visibility: 'private', automation: 'none' },
      },
      memoryWindow: [
        {
          id: 'mem-gold',
          kind: 'fact',
          summary: 'fixture memory',
          personaId: raw.personaId,
          candidateId: 'c-gold',
          payload: { text: 'fixture' },
          createdAt: '2026-08-17T00:00:00.000Z',
        },
      ],
    }),
  };

  const runRepo = {
    create: (data: Partial<WriteRunEntity>) =>
      ({
        id: data.id ?? `run-${runs.size + 1}`,
        createdAt: new Date('2026-08-17T04:00:00.000Z'),
        ...data,
      }) as WriteRunEntity,
    save: async (entity: WriteRunEntity) => {
      runs.set(entity.id, entity);
      return entity;
    },
    findOne: async ({ where }: { where: { id: string } }) => runs.get(where.id) ?? null,
  };

  let service: WriteService;

  beforeEach(() => {
    runs.clear();
    service = new WriteService(
      growth as never,
      runRepo as never,
      new LlmWrapperClient({ baseUrl: null }),
    );
  });

  const fixtures = loadGoldFixtures();

  it('loads post/comment/reply pass + skip fixtures', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(6);
    const kinds = new Set(fixtures.map((f) => f.kind));
    expect(kinds.has('post')).toBe(true);
    expect(kinds.has('comment')).toBe(true);
    expect(kinds.has('reply')).toBe(true);
  });

  for (const fixture of fixtures) {
    it(`${fixture.id}: ${fixture.kind} → ${fixture.expect.status} shape`, async () => {
      const result = await service.write('user-gold', {
        personaId: 'persona-gold',
        kind: fixture.kind,
        language: fixture.language,
        source: fixture.source as never,
      });
      assertPassOrSkipShape(result, fixture.expect.status);
      expect(JSON.stringify(result)).not.toMatch(/fixture memory/);
    });
  }
});

describe('quality harden: leak / length / language via physical-laws', () => {
  it('leak case fails physical laws', () => {
    expect(writeLawCodes({ text: 'Built with personaAgent internals' })).toContain('internal_leak');
  });

  it('length case fails physical laws', () => {
    expect(writeLawCodes({ text: 'x'.repeat(50), maxChars: 20 })).toContain('over_length');
  });

  it('language case fails physical laws', () => {
    expect(
      writeLawCodes({
        text: 'Completely English body for a Korean job.',
        language: 'ko',
      }),
    ).toContain('wrong_language');
  });

  it('skips write when draft leaks (stub judge path never sees rewrite)', async () => {
    const runs = new Map<string, WriteRunEntity>();
    const growth = {
      project: async () => ({
        personaId: 'p1',
        kind: 'post',
        channel: null,
        language: 'en',
        contract: {
          identity: { who: 'a', intent: 'ship', language: 'en' },
          voice: { typing: 'short', stance: 'direct', sampleSentences: ['hi'] },
          boundaries: { doNotSay: [] },
          permissions: { visibility: 'private', automation: 'none' },
        },
        memoryWindow: [],
      }),
    };
    const runRepo = {
      create: (data: Partial<WriteRunEntity>) =>
        ({ id: 'run-leak', createdAt: new Date(), ...data }) as WriteRunEntity,
      save: async (entity: WriteRunEntity) => {
        runs.set(entity.id, entity);
        return entity;
      },
      findOne: async () => null,
    };
    const llm = new LlmWrapperClient({
      baseUrl: 'http://fake',
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            output: { answer: JSON.stringify({ text: 'See getPersona docs for this.' }) },
          }),
          { status: 200 },
        ),
    });
    const svc = new WriteService(growth as never, runRepo as never, llm);
    const result = await svc.write('u1', {
      personaId: 'p1',
      kind: 'post',
      source: { text: 'announce' },
    });
    expect(result.status).toBe('skip');
    expect(result.reason).toBe('internal_leak');
  });

  it('skips write when language mismatches', async () => {
    const growth = {
      project: async () => ({
        personaId: 'p1',
        kind: 'post',
        channel: null,
        language: 'ko',
        contract: {
          identity: { who: 'a', intent: 'ship', language: 'ko' },
          voice: { typing: 'short', stance: 'direct', sampleSentences: ['안녕'] },
          boundaries: { doNotSay: [] },
          permissions: { visibility: 'private', automation: 'none' },
        },
        memoryWindow: [],
      }),
    };
    const runRepo = {
      create: (data: Partial<WriteRunEntity>) =>
        ({ id: 'run-lang', createdAt: new Date(), ...data }) as WriteRunEntity,
      save: async (entity: WriteRunEntity) => entity,
      findOne: async () => null,
    };
    const llm = new LlmWrapperClient({
      baseUrl: 'http://fake',
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            output: {
              answer: JSON.stringify({
                text: 'Totally English shipping notes for Korean request.',
              }),
            },
          }),
          { status: 200 },
        ),
    });
    const svc = new WriteService(growth as never, runRepo as never, llm);
    const result = await svc.write('u1', {
      personaId: 'p1',
      kind: 'post',
      language: 'ko',
      source: { text: '배포 안내' },
    });
    expect(result.status).toBe('skip');
    expect(result.reason).toBe('wrong_language');
  });
});
