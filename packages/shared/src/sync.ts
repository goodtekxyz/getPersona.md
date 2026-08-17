import { z } from 'zod';

export const syncJobStatusSchema = z.enum(['queued', 'running', 'done', 'failed']);

export const syncSourceKindSchema = z.enum(['blog', 'x', 'threads']);

export const syncSourceHandlesSchema = z
  .object({
    blog: z.string().max(512).optional(),
    x: z.string().max(128).optional(),
    threads: z.string().max(128).optional(),
  })
  .refine((h) => Boolean(h.blog?.trim() || h.x?.trim() || h.threads?.trim()), {
    message: 'At least one source handle is required.',
  });

export const enqueueSyncSchema = z.object({
  personaId: z.string().min(1),
  handles: syncSourceHandlesSchema,
});

export const syncAdapterResultSchema = z.object({
  source: syncSourceKindSchema,
  handle: z.string(),
  status: z.enum(['stub', 'error']),
  message: z.string(),
  artifactKey: z.string().nullable().optional(),
});

export const syncJobSchema = z.object({
  id: z.string(),
  personaId: z.string(),
  status: syncJobStatusSchema,
  handles: z.object({
    blog: z.string().optional(),
    x: z.string().optional(),
    threads: z.string().optional(),
  }),
  error: z.string().nullable(),
  adapterResults: z.array(syncAdapterResultSchema),
  artifactKeys: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  finishedAt: z.string().nullable(),
});

export type SyncJobStatus = z.infer<typeof syncJobStatusSchema>;
export type SyncSourceKind = z.infer<typeof syncSourceKindSchema>;
export type SyncSourceHandles = z.infer<typeof syncSourceHandlesSchema>;
export type EnqueueSyncInput = z.infer<typeof enqueueSyncSchema>;
export type SyncAdapterResult = z.infer<typeof syncAdapterResultSchema>;
export type SyncJob = z.infer<typeof syncJobSchema>;
