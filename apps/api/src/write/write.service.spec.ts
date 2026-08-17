import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { WriteService } from './write.service.js';
import { LlmWrapperClient } from './llm-wrapper.client.js';
import type { WriteRunEntity } from './write-run.entity.js';

describe('WriteService', () => {
  const runs = new Map<string, WriteRunEntity>();
  let projectCalls = 0;
  let ownershipOk = true;

  const growth = {
    project: async (actorUserId: string, raw: { personaId: string; kind: string }) => {
      projectCalls += 1;
      if (!ownershipOk) {
        throw new ForbiddenException("You don't have access to this persona.");
      }
      if (raw.personaId === 'missing') {
        throw new NotFoundException('Persona not found.');
      }
      return {
        personaId: raw.personaId,
        kind: raw.kind,
        channel: null,
        language: 'en',
        contract: {
          identity: { who: 'a', intent: 'ship', language: 'en' },
          voice: { typing: 'short', stance: 'direct', sampleSentences: ['hi'] },
          boundaries: { doNotSay: [] },
          permissions: { visibility: 'private', automation: 'none' },
        },
        memoryWindow: [
          {
            id: 'mem-1',
            kind: 'fact',
            summary: 'shipped M3',
            personaId: raw.personaId,
            candidateId: 'c1',
            payload: { text: 'shipped' },
            createdAt: '2026-08-17T00:00:00.000Z',
          },
        ],
      };
    },
  };

  const runRepo = {
    create: (data: Partial<WriteRunEntity>) =>
      ({
        id: data.id ?? `run-${runs.size + 1}`,
        createdAt: new Date('2026-08-17T02:00:00.000Z'),
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
    projectCalls = 0;
    ownershipOk = true;
    service = new WriteService(
      growth as never,
      runRepo as never,
      new LlmWrapperClient({ baseUrl: null }),
    );
  });

  it('returns text|skip with runId and memoryUsed via stub LLM', async () => {
    const result = await service.write('user-a', {
      personaId: 'persona-1',
      kind: 'post',
      source: { text: 'we shipped growth' },
    });
    expect(projectCalls).toBe(1);
    expect(result.status).toBe('text');
    expect(result.text).toMatch(/stub post/i);
    expect(result.runId).toBeTruthy();
    expect(result.memoryUsed).toEqual(['mem-1']);
    expect(result).not.toHaveProperty('memoryWindow');
    expect(JSON.stringify(result)).not.toMatch(/shipped M3/);
  });

  it('supports comment and reply kinds', async () => {
    const comment = await service.write('user-a', {
      personaId: 'persona-1',
      kind: 'comment',
      source: { text: 'nice post' },
    });
    expect(comment.status).toBe('text');
    expect(comment.text).toMatch(/stub comment/i);

    const reply = await service.write('user-a', {
      personaId: 'persona-1',
      kind: 'reply',
      source: { thread: [{ text: 'hello?' }] },
    });
    expect(reply.status).toBe('text');
    expect(reply.text).toMatch(/stub reply/i);
  });

  it('skips on stub cue without dumping memory', async () => {
    const result = await service.write('user-a', {
      personaId: 'persona-1',
      kind: 'post',
      source: { text: 'SKIP_PLEASE' },
    });
    expect(result.status).toBe('skip');
    expect(result.reason).toBeTruthy();
    expect(result.memoryUsed).toEqual(['mem-1']);
  });

  it('enforces ownership via project()', async () => {
    ownershipOk = false;
    await expect(
      service.write('user-b', {
        personaId: 'persona-1',
        kind: 'post',
        source: { text: 'hi' },
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('stores run entity/trace', async () => {
    const result = await service.write('user-a', {
      personaId: 'persona-1',
      kind: 'post',
      source: { brief: 'note', text: 'hello' },
    });
    const stored = await service.getRun('user-a', result.runId);
    expect(stored?.status).toBe('text');
    expect(stored?.memoryUsed).toEqual(['mem-1']);
    expect(stored?.trace.llm?.draftStubbed).toBe(true);
    expect(await service.getRun('other', result.runId)).toBeNull();
  });

  it('skips when physical law over_length', async () => {
    let calls = 0;
    const counting = new LlmWrapperClient({
      baseUrl: 'http://fake',
      fetchImpl: async () => {
        calls += 1;
        return new Response(
          JSON.stringify({
            output: { answer: JSON.stringify({ text: 'abcdefghij' }) },
          }),
          { status: 200 },
        );
      },
    });
    const svc = new WriteService(growth as never, runRepo as never, counting);
    const result = await svc.write('user-a', {
      personaId: 'persona-1',
      kind: 'post',
      source: { text: 'hi' },
      constraints: { maxLength: 5 },
    });
    expect(result.status).toBe('skip');
    expect(result.reason).toBe('over_length');
    expect(calls).toBe(1);
  });
});
