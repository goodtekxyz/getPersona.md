import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GrowthService } from './growth.service.js';
import type { EpisodeEntity } from './episode.entity.js';
import type { CandidateEntity } from './candidate.entity.js';
import type { LtmMemoryEntity } from './ltm-memory.entity.js';
import type { GrowthAuditEntity } from './growth-audit.entity.js';
import type { PersonaEntity } from '../personas/persona.entity.js';

function makePersona(overrides: Partial<PersonaEntity> = {}): PersonaEntity {
  const now = new Date('2026-08-17T00:00:00.000Z');
  return {
    id: 'persona-1',
    ownerUserId: 'user-a',
    displayName: 'Alpha',
    slug: 'alpha',
    identity: { who: 'a', intent: 'ship', language: 'en' },
    voice: { typing: 'short', stance: 'direct', sampleSentences: ['hi'] },
    boundaries: { doNotSay: [] },
    permissions: { visibility: 'private', automation: 'none' },
    isPublic: false,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
    assignId() {},
    ...overrides,
  } as PersonaEntity;
}

describe('GrowthService', () => {
  const episodes = new Map<string, EpisodeEntity>();
  const candidates = new Map<string, CandidateEntity>();
  const ltm = new Map<string, LtmMemoryEntity>();
  const audits: GrowthAuditEntity[] = [];
  let persona = makePersona();
  let service: GrowthService;

  const personas = {
    requireOwnedActive: async (id: string, ownerUserId: string) => {
      if (persona.id !== id) throw new NotFoundException('Persona not found.');
      if (persona.ownerUserId !== ownerUserId) {
        throw new ForbiddenException("You don't have access to this persona.");
      }
      if (persona.archivedAt) throw new ForbiddenException('Persona is archived.');
      return persona;
    },
    applyPromotedContract: async (
      id: string,
      ownerUserId: string,
      kind: 'identity' | 'voice' | 'boundary',
      payload: Record<string, unknown>,
    ) => {
      await personas.requireOwnedActive(id, ownerUserId);
      if (kind === 'identity' && typeof payload.who === 'string') {
        persona = {
          ...persona,
          identity: { ...persona.identity, who: payload.who },
          assignId: persona.assignId,
        } as PersonaEntity;
      }
      return persona;
    },
  };

  const episodeRepo = {
    findOne: async ({
      where,
    }: {
      where: { personaId?: string; sourceKind?: string; sourceId?: string; id?: string };
    }) => {
      if (where.id) return episodes.get(where.id) ?? null;
      return (
        [...episodes.values()].find(
          (e) =>
            e.personaId === where.personaId &&
            e.sourceKind === where.sourceKind &&
            e.sourceId === where.sourceId,
        ) ?? null
      );
    },
    create: (data: Partial<EpisodeEntity>) =>
      ({
        id: data.id ?? `ep-${episodes.size + 1}`,
        createdAt: new Date('2026-08-17T01:00:00.000Z'),
        ...data,
      }) as EpisodeEntity,
    save: async (entity: EpisodeEntity) => {
      episodes.set(entity.id, entity);
      return entity;
    },
  };

  const candidateRepo = {
    findOne: async ({
      where,
      order: _order,
    }: {
      where: { id?: string; episodeId?: string };
      order?: unknown;
    }) => {
      if (where.id) return candidates.get(where.id) ?? null;
      if (where.episodeId) {
        return [...candidates.values()].find((c) => c.episodeId === where.episodeId) ?? null;
      }
      return null;
    },
    find: async ({ where }: { where: { personaId: string; status?: string } }) =>
      [...candidates.values()].filter(
        (c) => c.personaId === where.personaId && (!where.status || c.status === where.status),
      ),
    create: (data: Partial<CandidateEntity>) =>
      ({
        id: data.id ?? `cand-${candidates.size + 1}`,
        createdAt: new Date('2026-08-17T01:00:00.000Z'),
        promotedAt: null,
        status: 'pending',
        ...data,
      }) as CandidateEntity,
    save: async (entity: CandidateEntity) => {
      candidates.set(entity.id, entity);
      return entity;
    },
  };

  const ltmRepo = {
    findOne: async ({ where }: { where: { candidateId: string } }) =>
      [...ltm.values()].find((m) => m.candidateId === where.candidateId) ?? null,
    find: async ({ where }: { where: { personaId: string } }) =>
      [...ltm.values()]
        .filter((m) => m.personaId === where.personaId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    create: (data: Partial<LtmMemoryEntity>) =>
      ({
        id: data.id ?? `ltm-${ltm.size + 1}`,
        createdAt: new Date('2026-08-17T02:00:00.000Z'),
        ...data,
      }) as LtmMemoryEntity,
    save: async (entity: LtmMemoryEntity) => {
      ltm.set(entity.id, entity);
      return entity;
    },
  };

  const auditRepo = {
    create: (data: Partial<GrowthAuditEntity>) =>
      ({ id: `audit-${audits.length + 1}`, createdAt: new Date(), ...data }) as GrowthAuditEntity,
    save: async (entity: GrowthAuditEntity) => {
      audits.push(entity);
      return entity;
    },
  };

  beforeEach(() => {
    episodes.clear();
    candidates.clear();
    ltm.clear();
    audits.length = 0;
    persona = makePersona();
    service = new GrowthService(
      personas as never,
      episodeRepo as never,
      candidateRepo as never,
      ltmRepo as never,
      auditRepo as never,
    );
  });

  it('remember is idempotent on sourceKind+sourceId', async () => {
    const first = await service.remember('user-a', {
      personaId: 'persona-1',
      sourceKind: 'run',
      sourceId: 'run-1',
      summary: 'learned a fact',
      candidate: { kind: 'fact', payload: { text: 'ships weekly' } },
    });
    expect(first.idempotent).toBe(false);
    expect(audits).toHaveLength(1);

    const second = await service.remember('user-a', {
      personaId: 'persona-1',
      sourceKind: 'run',
      sourceId: 'run-1',
      summary: 'different summary ignored',
      candidate: { kind: 'fact', payload: { text: 'ignored' } },
    });
    expect(second.idempotent).toBe(true);
    expect(second.episode.id).toBe(first.episode.id);
    expect(second.candidate.id).toBe(first.candidate.id);
    expect(audits).toHaveLength(1);
    expect(episodes.size).toBe(1);
  });

  it('promote fact writes LTM and appears in project window', async () => {
    const remembered = await service.remember('user-a', {
      personaId: 'persona-1',
      sourceKind: 'feedback',
      sourceId: 'fb-1',
      summary: 'ships weekly',
      candidate: { kind: 'fact', payload: { text: 'ships weekly' } },
    });

    const promoted = await service.promote('user-a', {
      candidateId: remembered.candidate.id,
    });
    expect(promoted.alreadyPromoted).toBe(false);
    expect(promoted.ltm?.kind).toBe('fact');
    expect(audits.filter((a) => a.action === 'promote')).toHaveLength(1);

    const projected = await service.project('user-a', {
      personaId: 'persona-1',
      kind: 'post',
    });
    expect(projected.contract.identity.who).toBe('a');
    expect(projected.memoryWindow).toHaveLength(1);
    expect(projected.memoryWindow[0].id).toBe(promoted.ltm!.id);
  });

  it('identity promote requires confirmGate', async () => {
    const remembered = await service.remember('user-a', {
      personaId: 'persona-1',
      sourceKind: 'review',
      sourceId: 'rv-1',
      summary: 'who update',
      candidate: { kind: 'identity', payload: { who: 'builder' } },
    });

    await expect(
      service.promote('user-a', { candidateId: remembered.candidate.id }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    const promoted = await service.promote('user-a', {
      candidateId: remembered.candidate.id,
      confirmGate: true,
    });
    expect(promoted.ltm).toBeNull();
    expect(persona.identity.who).toBe('builder');
  });

  it('rejects promote of non-pending candidate', async () => {
    const remembered = await service.remember('user-a', {
      personaId: 'persona-1',
      sourceKind: 'x',
      sourceId: '1',
      summary: 's',
      candidate: { kind: 'decision', payload: { decision: 'yes' } },
    });
    await service.promote('user-a', { candidateId: remembered.candidate.id });
    const again = await service.promote('user-a', { candidateId: remembered.candidate.id });
    expect(again.alreadyPromoted).toBe(true);

    const rejected = candidates.get(remembered.candidate.id)!;
    rejected.status = 'rejected';
    candidates.set(rejected.id, rejected);
    await expect(
      service.promote('user-a', { candidateId: remembered.candidate.id }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
