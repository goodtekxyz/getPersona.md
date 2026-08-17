import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaEntity } from './persona.entity.js';
import { PersonasController } from './personas.controller.js';
import { PersonasService } from './personas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaEntity])],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}
