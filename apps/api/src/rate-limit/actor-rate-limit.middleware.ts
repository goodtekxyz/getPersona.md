import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { optionalActor, setRequestActor } from '../auth/actor.js';
import { ApiKeysService } from '../api-keys/api-keys.service.js';
import { RateLimitService } from './rate-limit.service.js';

/**
 * Attaches Actor (Bearer key or session) and applies Redis/memory rate limits per key+account.
 */
@Injectable()
export class ActorRateLimitMiddleware implements NestMiddleware {
  constructor(
    private readonly apiKeys: ApiKeysService,
    private readonly rateLimit: RateLimitService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path ?? '';
    if (!path.startsWith('/v1') && !path.startsWith('/mcp')) {
      next();
      return;
    }
    try {
      const actor = await optionalActor(req, (h) => this.apiKeys.lookupByHash(h));
      if (actor) {
        setRequestActor(req, actor);
        const result = await this.rateLimit.consumeForActor({
          userId: actor.userId,
          apiKeyId: actor.apiKeyId,
        });
        res.setHeader('X-RateLimit-Limit', String(this.rateLimit.config.maxPerWindow));
        res.setHeader('X-RateLimit-Remaining', String(result.remaining));
        res.setHeader('X-RateLimit-Reset', String(Math.ceil(result.resetMs / 1000)));
        if (!result.allowed) {
          throw new HttpException(
            {
              message: 'Too many requests — try again shortly.',
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}
