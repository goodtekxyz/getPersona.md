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

export {
  memoryKindSchema,
  writeKindSchema,
  candidateStatusSchema,
  rememberSchema,
  promoteSchema,
  projectSchema,
  CONTRACT_MEMORY_KINDS,
  requiresPromoteGate,
} from './growth';

export type {
  MemoryKind,
  WriteKind,
  CandidateStatus,
  RememberInput,
  PromoteInput,
  ProjectInput,
} from './growth';

export {
  writeSubjectsSchema,
  writeSourceSchema,
  writeConstraintsSchema,
  writeSchema,
  writeStatusSchema,
  writeResultSchema,
  DEFAULT_WRITE_MAX_LENGTH,
} from './write';

export type {
  WriteSubjects,
  WriteSource,
  WriteConstraints,
  WriteInput,
  WriteStatus,
  WriteResult,
} from './write';

export { apiKeyScopeSchema, apiKeyScopesSchema, createApiKeySchema } from './api-key';

export type { ApiKeyScope, CreateApiKeyInput } from './api-key';

export {
  syncJobStatusSchema,
  syncSourceKindSchema,
  syncSourceHandlesSchema,
  enqueueSyncSchema,
  syncAdapterResultSchema,
  syncJobSchema,
} from './sync';

export type {
  SyncJobStatus,
  SyncSourceKind,
  SyncSourceHandles,
  EnqueueSyncInput,
  SyncAdapterResult,
  SyncJob,
} from './sync';
