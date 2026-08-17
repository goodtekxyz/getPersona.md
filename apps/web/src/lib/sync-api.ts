import type { EnqueueSyncInput, SyncJob } from '@getpersona/shared';

const apiBase = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(', ');
      else if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function enqueueSync(body: EnqueueSyncInput) {
  return apiFetch<SyncJob>('/v1/sync', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getSyncJob(jobId: string) {
  return apiFetch<SyncJob>(`/v1/sync/${jobId}`);
}
