import { createHash } from 'node:crypto';
import { ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import type { ApiKeyScope } from '@getpersona/shared';

export type { ApiKeyScope };

export type ActorAuthType = 'session' | 'api_key';

export interface Actor {
  userId: string;
  authType: ActorAuthType;
  scopes: ReadonlySet<ApiKeyScope>;
  apiKeyId?: string;
}

export type RequestWithActor = Request & { actor?: Actor };

export function hashApiKey(plaintext: string): string {
  return createHash('sha256').update(plaintext, 'utf8').digest('hex');
}

export function extractBearerToken(req: Request): string | null {
  const header = req.header('authorization');
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}

export function requireScope(actor: Actor, scope: ApiKeyScope): void {
  if (!actor.scopes.has(scope)) {
    throw new ForbiddenException(
      scope === 'promote'
        ? 'Promote scope required (write-only key cannot promote).'
        : `Missing required scope: ${scope}.`,
    );
  }
}

export function getRequestActor(req: Request): Actor | undefined {
  return (req as RequestWithActor).actor;
}

export function setRequestActor(req: Request, actor: Actor): void {
  (req as RequestWithActor).actor = actor;
}
