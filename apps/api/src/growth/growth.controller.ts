import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { requireUser } from '../auth/require-user.js';
import { RememberDto, PromoteDto, ProjectDto } from './dto/growth.dto.js';
import { GrowthService } from './growth.service.js';
import { requirePromoteCredential } from './require-promote-credential.js';

@Controller('v1/growth')
export class GrowthController {
  constructor(private readonly growth: GrowthService) {}

  /** Write-session path: episode + candidate (idempotent on sourceKind+sourceId). */
  @Post('remember')
  async remember(@Req() req: Request, @Body() body: RememberDto) {
    const user = await requireUser(req);
    return this.growth.remember(user.id, body);
  }

  /** Operator list — session owner only. */
  @Get('candidates')
  async listCandidates(
    @Req() req: Request,
    @Query('personaId') personaId: string,
    @Query('status') status?: string,
  ) {
    const user = await requireUser(req);
    return this.growth.listCandidates(user.id, personaId, status);
  }

  /**
   * Promote credential required (header), separate from write session.
   * Identity/voice/boundary also need confirmGate=true.
   */
  @Post('promote')
  async promote(@Req() req: Request, @Body() body: PromoteDto) {
    requirePromoteCredential(req);
    const user = await requireUser(req);
    return this.growth.promote(user.id, body);
  }

  /** Narrow contract + memory window for a write kind. */
  @Post('project')
  async project(@Req() req: Request, @Body() body: ProjectDto) {
    const user = await requireUser(req);
    return this.growth.project(user.id, body);
  }
}
