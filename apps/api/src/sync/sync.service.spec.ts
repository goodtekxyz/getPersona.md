import { SyncService } from './sync.service.js';
import { SyncJobEntity } from './sync-job.entity.js';
import { S3ArtifactClient, s3ConfigFromEnv } from './s3-artifact.client.js';
import type { SyncQueueService } from './sync-queue.service.js';

function mockRepo(store: Map<string, SyncJobEntity>) {
  return {
    create: (data: Partial<SyncJobEntity>) => {
      const e = Object.assign(new SyncJobEntity(), data);
      e.assignId();
      e.createdAt = new Date();
      e.updatedAt = new Date();
      return e;
    },
    save: async (entity: SyncJobEntity) => {
      store.set(entity.id, entity);
      entity.updatedAt = new Date();
      return entity;
    },
    findOne: async ({ where }: { where: { id: string } }) => store.get(where.id) ?? null,
  };
}

describe('SyncService', () => {
  it('enqueue → processJob runs stub adapters to done', async () => {
    const store = new Map<string, SyncJobEntity>();
    const repo = mockRepo(store);
    let registered: ((data: { jobId: string }) => Promise<void>) | null = null;

    const queue = {
      registerProcessor: (fn: (data: { jobId: string }) => Promise<void>) => {
        registered = fn;
      },
      enqueue: async (data: { jobId: string }) => {
        if (registered) await registered(data);
      },
    } as unknown as SyncQueueService;

    const personas = {
      requireOwnedActive: async (id: string, owner: string) => {
        if (id !== 'persona-1' || owner !== 'user-1') {
          throw new Error('forbidden');
        }
        return { id };
      },
    };

    const service = new SyncService(
      repo as never,
      personas as never,
      queue,
      new S3ArtifactClient(s3ConfigFromEnv({})),
    );
    service.onModuleInit();

    let hookCalled = false;
    service.setPostProcessHook(async () => {
      hookCalled = true;
    });

    const job = await service.enqueue('user-1', {
      personaId: 'persona-1',
      handles: { blog: 'https://blog.example/kai', x: '@kai' },
    });

    expect(job.status).toBe('done');
    expect(job.adapterResults).toHaveLength(2);
    expect(job.adapterResults.every((r) => r.status === 'stub')).toBe(true);
    expect(job.artifactKeys.length).toBe(2);
    expect(hookCalled).toBe(true);

    const loaded = await service.getJob('user-1', job.id);
    expect(loaded.status).toBe('done');
  });

  it('processJob marks failed when post-process throws', async () => {
    const store = new Map<string, SyncJobEntity>();
    const repo = mockRepo(store);
    const queue = {
      registerProcessor: () => undefined,
      enqueue: async () => undefined,
    } as unknown as SyncQueueService;

    const service = new SyncService(
      repo as never,
      { requireOwnedActive: async () => ({ id: 'p' }) } as never,
      queue,
      new S3ArtifactClient(s3ConfigFromEnv({})),
    );

    const entity = repo.create({
      personaId: 'p',
      actorUserId: 'u',
      handles: { threads: '@u' },
      status: 'queued',
      error: null,
      adapterResults: [],
      artifactKeys: [],
      finishedAt: null,
    });
    await repo.save(entity);

    service.setPostProcessHook(async () => {
      throw new Error('hook boom');
    });

    await service.processJob(entity.id);
    const after = store.get(entity.id)!;
    expect(after.status).toBe('failed');
    expect(after.error).toMatch(/hook boom/);
  });
});
