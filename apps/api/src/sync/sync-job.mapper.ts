import type { SyncJobEntity } from './sync-job.entity.js';
import type { SyncJob as SyncJobDto } from '@getpersona/shared';

export function toSyncJobDto(entity: SyncJobEntity): SyncJobDto {
  return {
    id: entity.id,
    personaId: entity.personaId,
    status: entity.status,
    handles: {
      ...(entity.handles.blog ? { blog: entity.handles.blog } : {}),
      ...(entity.handles.x ? { x: entity.handles.x } : {}),
      ...(entity.handles.threads ? { threads: entity.handles.threads } : {}),
    },
    error: entity.error,
    adapterResults: entity.adapterResults ?? [],
    artifactKeys: entity.artifactKeys ?? [],
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    finishedAt: entity.finishedAt ? entity.finishedAt.toISOString() : null,
  };
}
