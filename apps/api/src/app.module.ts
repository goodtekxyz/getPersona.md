import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { HealthController } from './health.controller.js';
import { HelmetMiddleware } from './helmet.middleware.js';
import { MeController } from './me/me.controller.js';
import { PersonasModule } from './personas/personas.module.js';
import { PersonaEntity } from './personas/persona.entity.js';
import { GrowthModule } from './growth/growth.module.js';
import { EpisodeEntity } from './growth/episode.entity.js';
import { CandidateEntity } from './growth/candidate.entity.js';
import { LtmMemoryEntity } from './growth/ltm-memory.entity.js';
import { GrowthAuditEntity } from './growth/growth-audit.entity.js';
import { WriteModule } from './write/write.module.js';
import { WriteRunEntity } from './write/write-run.entity.js';
import { ApiKeysModule } from './api-keys/api-keys.module.js';
import { ApiKeyEntity } from './api-keys/api-key.entity.js';
import { RateLimitModule } from './rate-limit/rate-limit.module.js';
import { ActorRateLimitMiddleware } from './rate-limit/actor-rate-limit.middleware.js';
import { McpModule } from './mcp/mcp.module.js';
import { SyncModule } from './sync/sync.module.js';
import { SyncJobEntity } from './sync/sync-job.entity.js';
import { auth } from './auth/auth.js';

const synchronize =
  process.env.TYPEORM_SYNC === 'true' ||
  (process.env.NODE_ENV !== 'production' && process.env.TYPEORM_SYNC !== 'false');

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        PersonaEntity,
        EpisodeEntity,
        CandidateEntity,
        LtmMemoryEntity,
        GrowthAuditEntity,
        WriteRunEntity,
        ApiKeyEntity,
        SyncJobEntity,
      ],
      synchronize,
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
    AuthModule.forRoot({
      auth,
      // Keep /health public without decorating every future public route.
      disableGlobalAuthGuard: true,
    }),
    ApiKeysModule,
    RateLimitModule,
    PersonasModule,
    GrowthModule,
    WriteModule,
    McpModule,
    SyncModule,
  ],
  controllers: [HealthController, MeController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
    consumer.apply(ActorRateLimitMiddleware).forRoutes('*');
  }
}
