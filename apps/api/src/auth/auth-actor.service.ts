import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { ApiKeyScope } from '@getpersona/shared';
import { optionalActor, requireActor, requireScope, getRequestActor, type Actor } from './actor.js';
import { ApiKeysService } from '../api-keys/api-keys.service.js';

@Injectable()
export class AuthActorService {
  constructor(private readonly apiKeys: ApiKeysService) {}

  private lookup = (hash: string) => this.apiKeys.lookupByHash(hash);

  require(req: Request): Promise<Actor> {
    return requireActor(req, this.lookup);
  }

  optional(req: Request): Promise<Actor | null> {
    return optionalActor(req, this.lookup);
  }

  async requireWithScope(req: Request, scope: ApiKeyScope): Promise<Actor> {
    const actor = await this.require(req);
    requireScope(actor, scope);
    return actor;
  }

  /** Prefer middleware-attached actor; otherwise resolve. */
  fromRequest(req: Request): Actor {
    const actor = getRequestActor(req);
    if (!actor) {
      throw new UnauthorizedException();
    }
    return actor;
  }
}
