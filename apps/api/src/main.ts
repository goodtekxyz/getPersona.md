import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false, // Required for Better Auth
  });
  app.useLogger(app.get(Logger));

  // JSON body for /v1; leave /api/auth to Better Auth (raw body).
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.url?.startsWith('/api/auth')) {
      next();
      return;
    }
    express.json()(req, res, next);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origins = (process.env.TRUSTED_ORIGINS ?? process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
