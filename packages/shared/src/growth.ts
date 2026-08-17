import { z } from 'zod';

/** Candidate / LTM kinds — identity|voice|boundary need promote + gate. */
export const memoryKindSchema = z.enum([
  'fact',
  'decision',
  'said',
  'relationship',
  'identity',
  'voice',
  'boundary',
]);

export const writeKindSchema = z.enum(['post', 'comment', 'reply']);

export const candidateStatusSchema = z.enum(['pending', 'promoted', 'rejected']);

export const rememberSchema = z.object({
  personaId: z.string().min(1),
  sourceKind: z.string().min(1).max(64),
  sourceId: z.string().min(1).max(128),
  summary: z.string().min(1).max(2000),
  candidate: z.object({
    kind: memoryKindSchema,
    payload: z.record(z.string(), z.unknown()),
  }),
});

export const promoteSchema = z.object({
  candidateId: z.string().min(1),
  /** Required for identity / voice / boundary (extra gate on top of promote credential). */
  confirmGate: z.boolean().optional(),
});

export const projectSchema = z.object({
  personaId: z.string().min(1),
  kind: writeKindSchema,
  channel: z.string().min(1).max(64).optional(),
  language: z.string().min(2).max(32).optional(),
  /** Optional hint for narrowing the memory window (substring match on summary/payload). */
  query: z.string().max(500).optional(),
  limit: z.number().int().min(0).max(20).optional(),
});

export type MemoryKind = z.infer<typeof memoryKindSchema>;
export type WriteKind = z.infer<typeof writeKindSchema>;
export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type RememberInput = z.infer<typeof rememberSchema>;
export type PromoteInput = z.infer<typeof promoteSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;

export const CONTRACT_MEMORY_KINDS: ReadonlySet<MemoryKind> = new Set([
  'identity',
  'voice',
  'boundary',
]);

export function requiresPromoteGate(kind: MemoryKind): boolean {
  return CONTRACT_MEMORY_KINDS.has(kind);
}
