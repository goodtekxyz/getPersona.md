import type { SyncAdapterResult, SyncSourceKind } from '@getpersona/shared';

export type SyncAdapterContext = {
  personaId: string;
  jobId: string;
};

/**
 * Platform scrape boundary. Real blog / X / Threads adapters come after M7.
 * Implementations must not hit the network in MVP stubs.
 */
export interface SyncAdapter {
  readonly source: SyncSourceKind;
  fetch(handle: string, ctx: SyncAdapterContext): Promise<SyncAdapterResult>;
}

export function createStubAdapter(source: SyncSourceKind): SyncAdapter {
  return {
    source,
    async fetch(handle: string): Promise<SyncAdapterResult> {
      const trimmed = handle.trim();
      return {
        source,
        handle: trimmed,
        status: 'stub',
        message: `Stub adapter for ${source}: no scrape yet (handle accepted).`,
        artifactKey: null,
      };
    },
  };
}

export const STUB_ADAPTERS: SyncAdapter[] = [
  createStubAdapter('blog'),
  createStubAdapter('x'),
  createStubAdapter('threads'),
];
