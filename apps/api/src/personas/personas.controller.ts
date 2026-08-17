import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { PublicRoute } from '../auth/public.decorator.js';
import { CreatePersonaDto, PatchPersonaDto } from './dto/persona.dto.js';
import { PersonasService } from './personas.service.js';

@ApiTags('personas')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1/personas')
export class PersonasController {
  constructor(
    private readonly personas: PersonasService,
    private readonly authActor: AuthActorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create persona' })
  async create(@Req() req: Request, @Body() body: CreatePersonaDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.personas.create(actor.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List owned personas' })
  async list(@Req() req: Request) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return { items: await this.personas.listOwned(actor.userId) };
  }

  /**
   * Public allowlist: unauthenticated access only when the persona isPublic.
   * Authenticated callers use ownership-or-public viewer rules.
   */
  @PublicRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Get persona (public only when isPublic + this route)' })
  async get(@Req() req: Request, @Param('id') id: string) {
    const actor = await this.authActor.optional(req);
    if (actor) {
      return this.personas.getForViewer(id, actor.userId);
    }
    return this.personas.getPublic(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Patch owned persona' })
  async patch(@Req() req: Request, @Param('id') id: string, @Body() body: PatchPersonaDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.personas.patch(id, actor.userId, body);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive owned persona' })
  async archive(@Req() req: Request, @Param('id') id: string) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.personas.archive(id, actor.userId);
  }

  @Post(':id/fork')
  @ApiOperation({ summary: 'Fork a public persona' })
  async fork(@Req() req: Request, @Param('id') id: string) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.personas.fork(id, actor.userId);
  }
}
