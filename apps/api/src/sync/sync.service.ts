import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { SyncAdapterResult, SyncSourceHandles, SyncSourceKind } from '@getpersona/shared';
import { PersonasService } from '../personas/personas.service.js';
import { STUB_ADAPTERS, type SyncAdapter } from './adapters/sync-adapter.js';
import { S3ArtifactClient, s3ConfigFromEnv } from './s3-artifact.client.js';
import { SyncJobEntity } from './sync-job.entity.js';
import { toSyncJobDto } from './sync-job.mapper.js';
import { SyncQueueService } from './sync-queue.service.js';

export type EnqueueSyncInput = {
  personaId: string;
  handles: SyncSourceHandles;
};

/**
 * Hook after stub adapters finish — candidate / contract patch.
 * M7: no-op (real promote pipeline stays on growth APIs).
 */
export type SyncPostProcessHook = (opts: {
  personaId: string;
  jobId: string;
  adapterResults: SyncAdapterResult[];
}) => Promise<void>;

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);
  private readonly adapters: Map<SyncSourceKind, SyncAdapter>;
  private postProcess: SyncPostProcessHook = async () => undefined;

  constructor(
    @InjectRepository(SyncJobEntity)
    private readonly jobs: Repository<SyncJobEntity>,
    private readonly personas: PersonasService,
    private readonly queue: SyncQueueService,
    private readonly s3: S3ArtifactClient,
  ) {
    this.adapters = new Map(STUB_ADAPTERS.map((a) => [a.source, a]));
  }

  onModuleInit() {
    this.queue.registerProcessor(async ({ jobId }) => {
      await this.processJob(jobId);
    });
  }

  /** Test / future wiring: replace no-op post-process hook. */
  setPostProcessHook(hook: SyncPostProcessHook) {
    this.postProcess = hook;
  }

  async enqueue(actorUserId: string, raw: EnqueueSyncInput) {
    await this.personas.requireOwnedActive(raw.personaId, actorUserId);

    const handles = normalizeHandles(raw.handles);
    const entity = this.jobs.create({
      personaId: raw.personaId,
      actorUserId,
      handles,
      status: 'queued',
      error: null,
      adapterResults: [],
      artifactKeys: [],
      finishedAt: null,
    });
    await this.jobs.save(entity);
    await this.queue.enqueue({ jobId: entity.id });
    return toSyncJobDto(entity);
  }

  async getJob(actorUserId: string, jobId: string) {
    const job = await this.jobs.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Sync job not found.');
    }
    if (job.actorUserId !== actorUserId) {
      throw new ForbiddenException('You don’t have access to this sync job.');
    }
    return toSyncJobDto(job);
  }

  async processJob(jobId: string): Promise<void> {
    const job = await this.jobs.findOne({ where: { id: jobId } });
    if (!job) {
      this.logger.warn(`Sync job ${jobId} missing — skip.`);
      return;
    }
    if (job.status === 'done' || job.status === 'failed') {
      return;
    }

    job.status = 'running';
    job.error = null;
    await this.jobs.save(job);

    const results: SyncAdapterResult[] = [];
    const artifactKeys: string[] = [];

    try {
      const sources = (['blog', 'x', 'threads'] as const).filter((s) =>
        Boolean(job.handles[s]?.trim()),
      );

      for (const source of sources) {
        const handle = job.handles[source]!.trim();
        const adapter = this.adapters.get(source);
        if (!adapter) {
          results.push({
            source,
            handle,
            status: 'error',
            message: `No adapter for ${source}.`,
            artifactKey: null,
          });
          continue;
        }

        const result = await adapter.fetch(handle, {
          personaId: job.personaId,
          jobId: job.id,
        });

        const key = this.s3.artifactKey({
          personaId: job.personaId,
          jobId: job.id,
          source,
        });
        const put = await this.s3.putObject({
          key,
          body: JSON.stringify({
            source,
            handle,
            stub: true,
            message: result.message,
            at: new Date().toISOString(),
          }),
          contentType: 'application/json',
        });
        artifactKeys.push(put.key);
        results.push({ ...result, artifactKey: put.key });
      }

      await this.postProcess({
        personaId: job.personaId,
        jobId: job.id,
        adapterResults: results,
      });

      job.adapterResults = results;
      job.artifactKeys = artifactKeys;
      job.status = 'done';
      job.finishedAt = new Date();
      job.error = null;
      await this.jobs.save(job);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed.';
      job.adapterResults = results;
      job.artifactKeys = artifactKeys;
      job.status = 'failed';
      job.error = message;
      job.finishedAt = new Date();
      await this.jobs.save(job);
      this.logger.error(`Sync job ${jobId} failed: ${message}`);
    }
  }
}

function normalizeHandles(handles: SyncSourceHandles): SyncSourceHandles {
  const out: SyncSourceHandles = {};
  if (handles.blog?.trim()) out.blog = handles.blog.trim();
  if (handles.x?.trim()) out.x = handles.x.trim();
  if (handles.threads?.trim()) out.threads = handles.threads.trim();
  return out;
}
