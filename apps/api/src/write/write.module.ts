import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthModule } from '../growth/growth.module.js';
import { LlmWrapperClient, llmWrapperConfigFromEnv } from './llm-wrapper.client.js';
import { WriteController } from './write.controller.js';
import { WriteRunEntity } from './write-run.entity.js';
import { WriteService } from './write.service.js';

@Module({
  imports: [GrowthModule, TypeOrmModule.forFeature([WriteRunEntity])],
  controllers: [WriteController],
  providers: [
    WriteService,
    {
      provide: LlmWrapperClient,
      useFactory: () => new LlmWrapperClient(llmWrapperConfigFromEnv()),
    },
  ],
  exports: [WriteService],
})
export class WriteModule {}
