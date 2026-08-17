import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { requireUser } from '../auth/require-user.js';
import { CreatePersonaDto, PatchPersonaDto } from './dto/persona.dto.js';
import { PersonasService } from './personas.service.js';

@Controller('v1/personas')
export class PersonasController {
  constructor(private readonly personas: PersonasService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CreatePersonaDto) {
    const user = await requireUser(req);
    return this.personas.create(user.id, body);
  }

  @Get()
  async list(@Req() req: Request) {
    const user = await requireUser(req);
    return { items: await this.personas.listOwned(user.id) };
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const user = await requireUser(req);
    return this.personas.getForViewer(id, user.id);
  }

  @Patch(':id')
  async patch(@Req() req: Request, @Param('id') id: string, @Body() body: PatchPersonaDto) {
    const user = await requireUser(req);
    return this.personas.patch(id, user.id, body);
  }

  @Post(':id/archive')
  async archive(@Req() req: Request, @Param('id') id: string) {
    const user = await requireUser(req);
    return this.personas.archive(id, user.id);
  }

  @Post(':id/fork')
  async fork(@Req() req: Request, @Param('id') id: string) {
    const user = await requireUser(req);
    return this.personas.fork(id, user.id);
  }
}
