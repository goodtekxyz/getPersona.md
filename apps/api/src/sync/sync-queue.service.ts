import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, type Job } from 'bullmq';
import { Redis } from 'ioredis';

export const SYNC_QUEUE_NAME = 'persona-sync';

export type SyncQueueJobData = {
  jobId: string;
};

export type SyncJobProcessor = (data: SyncQueueJobData) => Promise<void>;

/**
 * BullMQ enqueue + worker. Falls back to in-process async when REDIS_URL is unset
 * (same pattern as rate-limit memory fallback for local/CI).
 */
@Injectable()
export class SyncQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SyncQueueService.name);
  private queue: Queue<SyncQueueJobData> | null = null;
  private worker: Worker<SyncQueueJobData> | null = null;
  private connection: Redis | null = null;
  private processor: SyncJobProcessor | null = null;
  private readonly inlinePending = new Set<string>();

  onModuleInit() {
    const url = process.env.REDIS_URL?.trim();
    if (!url) {
      this.logger.warn('REDIS_URL unset — sync jobs run in-process (no BullMQ).');
      return;
    }

    try {
      this.connection = new Redis(url, {
        maxRetriesPerRequest: null,
        lazyConnect: true,
      });
      this.queue = new Queue(SYNC_QUEUE_NAME, { connection: this.connection.duplicate() });
      this.worker = new Worker(
        SYNC_QUEUE_NAME,
        async (job: Job<SyncQueueJobData>) => {
          if (!this.processor) {
            throw new Error('Sync job processor not registered.');
          }
          await this.processor(job.data);
        },
        { connection: this.connection.duplicate(), concurrency: 2 },
      );
      this.worker.on('failed', (job, err) => {
        this.logger.error(`Sync queue job ${job?.id} failed: ${err.message}`);
      });
      void this.connection.connect().catch((err: Error) => {
        this.logger.warn(`Redis connect failed — sync will use in-process: ${err.message}`);
        void this.teardownBull();
      });
    } catch (err) {
      this.logger.warn(
        `BullMQ init failed — sync will use in-process: ${err instanceof Error ? err.message : err}`,
      );
      void this.teardownBull();
    }
  }

  registerProcessor(processor: SyncJobProcessor) {
    this.processor = processor;
  }

  async enqueue(data: SyncQueueJobData): Promise<void> {
    if (this.queue) {
      try {
        await this.queue.add('sync', data, {
          jobId: data.jobId,
          removeOnComplete: 100,
          removeOnFail: 100,
          attempts: 1,
        });
        return;
      } catch (err) {
        this.logger.warn(
          `BullMQ enqueue failed — falling back in-process: ${err instanceof Error ? err.message : err}`,
        );
      }
    }
    this.enqueueInline(data);
  }

  private enqueueInline(data: SyncQueueJobData) {
    if (this.inlinePending.has(data.jobId)) return;
    this.inlinePending.add(data.jobId);
    setImmediate(() => {
      void (async () => {
        try {
          if (!this.processor) {
            throw new Error('Sync job processor not registered.');
          }
          await this.processor(data);
        } catch (err) {
          this.logger.error(
            `Inline sync job ${data.jobId} failed: ${err instanceof Error ? err.message : err}`,
          );
        } finally {
          this.inlinePending.delete(data.jobId);
        }
      })();
    });
  }

  async onModuleDestroy() {
    await this.teardownBull();
  }

  private async teardownBull() {
    const worker = this.worker;
    const queue = this.queue;
    const connection = this.connection;
    this.worker = null;
    this.queue = null;
    this.connection = null;
    await worker?.close().catch(() => undefined);
    await queue?.close().catch(() => undefined);
    if (connection) {
      try {
        await connection.quit();
      } catch {
        connection.disconnect();
      }
    }
  }
}
