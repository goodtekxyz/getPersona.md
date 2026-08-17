import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasModule } from '../personas/personas.module.js';
import { CandidateEntity } from './candidate.entity.js';
import { EpisodeEntity } from './episode.entity.js';
import { GrowthAuditEntity } from './growth-audit.entity.js';
import { GrowthController } from './growth.controller.js';
import { GrowthService } from './growth.service.js';
import { LtmMemoryEntity } from './ltm-memory.entity.js';

@Module({
  imports: [
    PersonasModule,
    TypeOrmModule.forFeature([EpisodeEntity, CandidateEntity, LtmMemoryEntity, GrowthAuditEntity]),
  ],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
