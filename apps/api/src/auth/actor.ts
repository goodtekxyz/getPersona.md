import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { ApiKeyScope } from '@getpersona/shared';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';
import {
  extractBearerToken,
  hashApiKey,
  type Actor,
  type RequestWithActor,
} from './actor-types.js';

export type { Actor, ActorAuthType, ApiKeyScope, RequestWithActor } from './actor-types.js';
export {
  extractBearerToken,
  getRequestActor,
  hashApiKey,
  requireScope,
  setRequestActor,
} from './actor-types.js';

export type ApiKeyLookup = (keyHash: string) => Promise<{
  id: string;
  ownerUserId: string;
  scopes: ApiKeyScope[];
  revokedAt: Date | null;
} | null>;

const SESSION_SCOPES: ReadonlySet<ApiKeyScope> = new Set(['write', 'promote']);

async function resolveActor(req: Request, lookupApiKey: ApiKeyLookup): Promise<Actor | null> {
  const bearer = extractBearerToken(req);
  if (bearer) {
    const row = await lookupApiKey(hashApiKey(bearer));
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid API key.');
    }
    return {
      userId: row.ownerUserId,
      authType: 'api_key',
      scopes: new Set(row.scopes),
      apiKeyId: row.id,
    };
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session?.user) return null;
  return {
    userId: session.user.id,
    authType: 'session',
    scopes: SESSION_SCOPES,
  };
}

/**
 * Resolve the caller via Bearer API key (preferred when present) or session cookie.
 * Reuses `req.actor` when ActorRateLimitMiddleware already attached it.
 */
export async function requireActor(req: Request, lookupApiKey: ApiKeyLookup): Promise<Actor> {
  const r = req as RequestWithActor;
  if (r.actor) return r.actor;
  const actor = await resolveActor(req, lookupApiKey);
  if (!actor) {
    throw new UnauthorizedException();
  }
  r.actor = actor;
  return actor;
}

/** Session or key when present; null when neither (for public allowlist routes). */
export async function optionalActor(
  req: Request,
  lookupApiKey: ApiKeyLookup,
): Promise<Actor | null> {
  const r = req as RequestWithActor;
  if (r.actor) return r.actor;
  const actor = await resolveActor(req, lookupApiKey);
  if (actor) r.actor = actor;
  return actor;
}
