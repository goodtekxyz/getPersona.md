import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { ApiKeyEntity } from './api-key.entity.js';
import { ApiKeysController } from './api-keys.controller.js';
import { ApiKeysService } from './api-keys.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, AuthActorService],
  exports: [ApiKeysService, AuthActorService],
})
export class ApiKeysModule {}
