import type { CreatePersonaInput, PatchPersonaInput, Persona } from '@getpersona/shared';

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
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type PersonaListResponse = { items: Persona[] };

export function listPersonas() {
  return apiFetch<PersonaListResponse>('/v1/personas');
}

export function getPersona(id: string) {
  return apiFetch<Persona>(`/v1/personas/${id}`);
}

export function createPersona(body: CreatePersonaInput) {
  return apiFetch<Persona>('/v1/personas', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function patchPersona(id: string, body: PatchPersonaInput) {
  return apiFetch<Persona>(`/v1/personas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function archivePersona(id: string) {
  return apiFetch<Persona>(`/v1/personas/${id}/archive`, { method: 'POST' });
}

export function forkPersona(id: string) {
  return apiFetch<Persona>(`/v1/personas/${id}/fork`, { method: 'POST' });
}
