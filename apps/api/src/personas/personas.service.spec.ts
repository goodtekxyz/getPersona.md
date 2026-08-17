import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PersonasService, serializePersona } from './personas.service.js';
import type { PersonaEntity } from './persona.entity.js';

function makeEntity(overrides: Partial<PersonaEntity> = {}): PersonaEntity {
  const now = new Date('2026-08-17T00:00:00.000Z');
  return {
    id: '01900000-0000-7000-8000-000000000001',
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

describe('PersonasService', () => {
  const store = new Map<string, PersonaEntity>();
  let service: PersonasService;

  const repo = {
    create: (data: Partial<PersonaEntity>) =>
      makeEntity({ ...data, id: data.id ?? `id-${store.size + 1}` }),
    save: async (entity: PersonaEntity) => {
      if (!entity.createdAt) entity.createdAt = new Date();
      entity.updatedAt = new Date();
      store.set(entity.id, entity);
      return entity;
    },
    find: async ({ where }: { where: { ownerUserId: string } }) =>
      [...store.values()].filter((p) => p.ownerUserId === where.ownerUserId && !p.archivedAt),
    findOne: async ({ where }: { where: { id?: string; ownerUserId?: string; slug?: string } }) => {
      if (where.id) return store.get(where.id) ?? null;
      return (
        [...store.values()].find(
          (p) => p.ownerUserId === where.ownerUserId && p.slug === where.slug,
        ) ?? null
      );
    },
    existsBy: async (where: { ownerUserId: string; slug: string }) =>
      [...store.values()].some((p) => p.ownerUserId === where.ownerUserId && p.slug === where.slug),
  };

  beforeEach(() => {
    store.clear();
    service = new PersonasService(repo as never);
  });

  it('create + list owned', async () => {
    const created = await service.create('user-a', {
      displayName: 'Kai',
      identity: { who: 'builder', intent: 'ship', language: 'ko' },
      voice: { typing: 'short', stance: 'direct', sampleSentences: [] },
    });
    expect(created.ownerUserId).toBe('user-a');
    const list = await service.listOwned('user-a');
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(created.id);
  });

  it('returns 403 for other users private persona', async () => {
    const created = await service.create('user-a', {
      displayName: 'Private',
      identity: { who: 'a', intent: 'b', language: 'en' },
      voice: { typing: 't', stance: 's', sampleSentences: [] },
    });
    await expect(service.getForViewer(created.id, 'user-b')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    await expect(service.getPublic(created.id)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.patch(created.id, 'user-b', { displayName: 'x' })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('getPublic allows isPublic personas only', async () => {
    const pub = await service.create('user-a', {
      displayName: 'Public',
      isPublic: true,
      identity: { who: 'a', intent: 'b', language: 'en' },
      voice: { typing: 't', stance: 's', sampleSentences: [] },
    });
    const viewed = await service.getPublic(pub.id);
    expect(viewed.id).toBe(pub.id);
    expect(viewed.isPublic).toBe(true);
  });

  it('forks public persona only', async () => {
    const pub = await service.create('user-a', {
      displayName: 'Public',
      isPublic: true,
      identity: { who: 'a', intent: 'b', language: 'en' },
      voice: { typing: 't', stance: 's', sampleSentences: ['hello'] },
      boundaries: { doNotSay: ['nope'] },
    });
    expect(pub.isPublic).toBe(true);

    const forked = await service.fork(pub.id, 'user-b');
    expect(forked.ownerUserId).toBe('user-b');
    expect(forked.isPublic).toBe(false);
    expect(forked.identity.who).toBe('a');
    expect(forked.displayName).toContain('fork');

    const priv = await service.create('user-a', {
      displayName: 'Secret',
      identity: { who: 'x', intent: 'y', language: 'en' },
      voice: { typing: 't', stance: 's', sampleSentences: [] },
    });
    await expect(service.fork(priv.id, 'user-b')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('archive sets archivedAt', async () => {
    const created = await service.create('user-a', {
      displayName: 'Arch',
      identity: { who: 'a', intent: 'b', language: 'en' },
      voice: { typing: 't', stance: 's', sampleSentences: [] },
    });
    const archived = await service.archive(created.id, 'user-a');
    expect(archived.archivedAt).toBeTruthy();
  });

  it('not found', async () => {
    await expect(service.getForViewer('missing', 'user-a')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('serializePersona uses ISO timestamps', () => {
    const s = serializePersona(makeEntity());
    expect(s.createdAt).toBe('2026-08-17T00:00:00.000Z');
    expect(s.archivedAt).toBeNull();
  });
});
