import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysModule } from '../api-keys/api-keys.module.js';
import { PersonasModule } from '../personas/personas.module.js';
import { S3ArtifactClient, s3ConfigFromEnv } from './s3-artifact.client.js';
import { SyncController } from './sync.controller.js';
import { SyncJobEntity } from './sync-job.entity.js';
import { SyncQueueService } from './sync-queue.service.js';
import { SyncService } from './sync.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SyncJobEntity]), ApiKeysModule, PersonasModule],
  controllers: [SyncController],
  providers: [
    SyncQueueService,
    SyncService,
    {
      provide: S3ArtifactClient,
      useFactory: () => new S3ArtifactClient(s3ConfigFromEnv()),
    },
  ],
  exports: [SyncService],
})
export class SyncModule {}
