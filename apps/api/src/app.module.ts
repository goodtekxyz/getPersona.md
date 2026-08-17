import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './health.controller';
import { HelmetMiddleware } from './helmet.middleware';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
      },
    }),
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
