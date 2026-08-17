import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module.js';
import { ActorRateLimitMiddleware } from './actor-rate-limit.middleware.js';
import { RateLimitService } from './rate-limit.service.js';

@Module({
  imports: [ApiKeysModule],
  providers: [RateLimitService, ActorRateLimitMiddleware],
  exports: [RateLimitService, ActorRateLimitMiddleware, ApiKeysModule],
})
export class RateLimitModule {}
