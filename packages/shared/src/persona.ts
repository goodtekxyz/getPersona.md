import { z } from 'zod';

/** Contract fields from docs/project/07-growth.md (Register). */
export const personaIdentitySchema = z.object({
  who: z.string().min(1).max(500),
  intent: z.string().min(1).max(500),
  language: z.string().min(2).max(32),
});

export const personaVoiceSchema = z.object({
  typing: z.string().min(1).max(500),
  stance: z.string().min(1).max(500),
  sampleSentences: z.array(z.string().min(1).max(300)).max(3),
});

export const personaBoundariesSchema = z.object({
  doNotSay: z.array(z.string().min(1).max(300)),
});

export const personaPermissionsSchema = z.object({
  visibility: z.enum(['private', 'public']),
  automation: z.enum(['none', 'assist', 'full']),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case');

export const createPersonaSchema = z.object({
  displayName: z.string().min(1).max(120),
  slug: slugSchema.optional(),
  identity: personaIdentitySchema,
  voice: personaVoiceSchema,
  boundaries: personaBoundariesSchema.default({ doNotSay: [] }),
  permissions: personaPermissionsSchema.default({
    visibility: 'private',
    automation: 'none',
  }),
  isPublic: z.boolean().optional(),
});

export const patchPersonaSchema = z
  .object({
    displayName: z.string().min(1).max(120).optional(),
    slug: slugSchema.optional(),
    identity: personaIdentitySchema.partial().optional(),
    voice: personaVoiceSchema
      .extend({
        sampleSentences: z.array(z.string().min(1).max(300)).max(3).optional(),
      })
      .partial()
      .optional(),
    boundaries: personaBoundariesSchema.partial().optional(),
    permissions: personaPermissionsSchema.partial().optional(),
    isPublic: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'at least one field required' });

export const personaSchema = z.object({
  id: z.string().min(1),
  ownerUserId: z.string().min(1),
  displayName: z.string(),
  slug: z.string(),
  identity: personaIdentitySchema,
  voice: personaVoiceSchema,
  boundaries: personaBoundariesSchema,
  permissions: personaPermissionsSchema,
  isPublic: z.boolean(),
  archivedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PersonaIdentity = z.infer<typeof personaIdentitySchema>;
export type PersonaVoice = z.infer<typeof personaVoiceSchema>;
export type PersonaBoundaries = z.infer<typeof personaBoundariesSchema>;
export type PersonaPermissions = z.infer<typeof personaPermissionsSchema>;
export type CreatePersonaInput = z.input<typeof createPersonaSchema>;
export type PatchPersonaInput = z.input<typeof patchPersonaSchema>;
export type Persona = z.infer<typeof personaSchema>;
