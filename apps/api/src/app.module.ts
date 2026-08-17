import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { HealthController } from './health.controller.js';
import { HelmetMiddleware } from './helmet.middleware.js';
import { MeController } from './me/me.controller.js';
import { auth } from './auth/auth.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
      },
    }),
    AuthModule.forRoot({
      auth,
      // Keep /health public without decorating every future public route.
      disableGlobalAuthGuard: true,
    }),
  ],
  controllers: [HealthController, MeController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
