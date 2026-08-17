import { z } from 'zod';
import { writeKindSchema } from './growth.js';

/** Closed subject slots — not free-form fields (docs/project/04-api.md). */
export const writeSubjectsSchema = z
  .object({
    own: z.string().max(128).optional(),
    speaker: z.string().max(128).optional(),
    host: z.string().max(128).optional(),
    about: z.string().max(128).optional(),
  })
  .optional();

export const writeSourceSchema = z.object({
  /** Short brief / instruction for this write. */
  brief: z.string().max(2000).optional(),
  /** Primary source text (post body, comment target, etc.). */
  text: z.string().max(8000).optional(),
  /** Thread turns for reply (oldest → newest). */
  thread: z
    .array(
      z.object({
        role: z.string().max(64).optional(),
        text: z.string().max(4000),
      }),
    )
    .max(40)
    .optional(),
});

export const writeConstraintsSchema = z
  .object({
    maxLength: z.number().int().min(1).max(4000).optional(),
    allowLinks: z.boolean().optional(),
    visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  })
  .optional();

export const writeSchema = z.object({
  personaId: z.string().min(1),
  kind: writeKindSchema,
  channel: z.string().min(1).max(64).optional(),
  language: z.string().min(2).max(32).optional(),
  source: writeSourceSchema.default({}),
  subjects: writeSubjectsSchema,
  constraints: writeConstraintsSchema,
  /** Optional project query hint (narrows memory window). */
  query: z.string().max(500).optional(),
  limit: z.number().int().min(0).max(20).optional(),
});

export const writeStatusSchema = z.enum(['text', 'skip']);

export const writeResultSchema = z.object({
  status: writeStatusSchema,
  text: z.string().optional(),
  reason: z.string().optional(),
  runId: z.string().min(1),
  memoryUsed: z.array(z.string()),
});

export type WriteSubjects = z.infer<typeof writeSubjectsSchema>;
export type WriteSource = z.infer<typeof writeSourceSchema>;
export type WriteConstraints = z.infer<typeof writeConstraintsSchema>;
export type WriteInput = z.infer<typeof writeSchema>;
export type WriteStatus = z.infer<typeof writeStatusSchema>;
export type WriteResult = z.infer<typeof writeResultSchema>;

/** Default public line length when constraints.maxLength omitted. */
export const DEFAULT_WRITE_MAX_LENGTH = 280;
