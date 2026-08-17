/** Shared constants and contracts for getPersona.md. */
export const PRODUCT_NAME = 'getPersona.md' as const;

export const HOSTS = {
  web: 'getpersona.md',
  agent: 'agent.getpersona.md',
  api: 'api.getpersona.md',
} as const;

export {
  personaIdentitySchema,
  personaVoiceSchema,
  personaBoundariesSchema,
  personaPermissionsSchema,
  slugSchema,
  createPersonaSchema,
  patchPersonaSchema,
  personaSchema,
} from './persona';

export type {
  PersonaIdentity,
  PersonaVoice,
  PersonaBoundaries,
  PersonaPermissions,
  CreatePersonaInput,
  PatchPersonaInput,
  Persona,
} from './persona';
