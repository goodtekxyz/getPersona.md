import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { HealthController } from './health.controller.js';
import { HelmetMiddleware } from './helmet.middleware.js';
import { MeController } from './me/me.controller.js';
import { PersonasModule } from './personas/personas.module.js';
import { PersonaEntity } from './personas/persona.entity.js';
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
      entities: [PersonaEntity],
      synchronize,
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),
    AuthModule.forRoot({
      auth,
      // Keep /health public without decorating every future public route.
      disableGlobalAuthGuard: true,
    }),
    PersonasModule,
  ],
  controllers: [HealthController, MeController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
