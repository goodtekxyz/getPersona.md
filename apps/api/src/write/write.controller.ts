import { Controller, Get, NotFoundException, Param, Post, Body, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { WriteDto } from './dto/write.dto.js';
import { WriteService } from './write.service.js';

@ApiTags('write')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1/write')
export class WriteController {
  constructor(
    private readonly writeService: WriteService,
    private readonly authActor: AuthActorService,
  ) {}

  /**
   * WriteJob: project → draft → judge → text|skip.
   * Bearer write-scoped key or session; LLM via llm_wrapper (or stub).
   */
  @Post()
  @ApiOperation({ summary: 'Write as persona (text|skip)' })
  async write(@Req() req: Request, @Body() body: WriteDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.writeService.write(actor.userId, body);
  }

  /** Debug/audit: run trace for the actor (memory ids + judgment, not memory dump). */
  @Get('runs/:runId')
  @ApiOperation({ summary: 'Get write run trace' })
  async getRun(@Req() req: Request, @Param('runId') runId: string) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    const run = await this.writeService.getRun(actor.userId, runId);
    if (!run) {
      throw new NotFoundException('Run not found.');
    }
    return run;
  }
}
