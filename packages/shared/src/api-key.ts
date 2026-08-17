import { z } from 'zod';

/** API key capability scopes — write cannot promote (D-007). */
export const apiKeyScopeSchema = z.enum(['write', 'promote']);

export const apiKeyScopesSchema = z
  .array(apiKeyScopeSchema)
  .min(1)
  .refine((scopes) => new Set(scopes).size === scopes.length, {
    message: 'Duplicate scopes are not allowed',
  });

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1).max(120),
  scopes: apiKeyScopesSchema.default(['write']),
});

export type ApiKeyScope = z.infer<typeof apiKeyScopeSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
