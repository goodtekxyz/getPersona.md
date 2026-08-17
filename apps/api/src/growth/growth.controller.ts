import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { RememberDto, PromoteDto, ProjectDto } from './dto/growth.dto.js';
import { GrowthService } from './growth.service.js';
import { requirePromoteAccess } from './require-promote-credential.js';

@ApiTags('growth')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1/growth')
export class GrowthController {
  constructor(
    private readonly growth: GrowthService,
    private readonly authActor: AuthActorService,
  ) {}

  /** Write path: episode + candidate (idempotent on sourceKind+sourceId). */
  @Post('remember')
  @ApiOperation({ summary: 'Remember observation as pending candidate' })
  async remember(@Req() req: Request, @Body() body: RememberDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.growth.remember(actor.userId, body);
  }

  /** Operator list — owner only. */
  @Get('candidates')
  @ApiOperation({ summary: 'List growth candidates for a persona' })
  async listCandidates(
    @Req() req: Request,
    @Query('personaId') personaId: string,
    @Query('status') status?: string,
  ) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.growth.listCandidates(actor.userId, personaId, status);
  }

  /**
   * Promote requires promote scope (API key) or session operator.
   * Identity/voice/boundary also need confirmGate=true.
   */
  @Post('promote')
  @ApiOperation({ summary: 'Promote candidate to LTM (promote scope required)' })
  async promote(@Req() req: Request, @Body() body: PromoteDto) {
    const actor = await this.authActor.require(req);
    requirePromoteAccess(actor);
    return this.growth.promote(actor.userId, body);
  }

  /** Narrow contract + memory window for a write kind. */
  @Post('project')
  @ApiOperation({ summary: 'Project narrow contract + memory window' })
  async project(@Req() req: Request, @Body() body: ProjectDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.growth.project(actor.userId, body);
  }
}
