import { Controller, Get, NotFoundException, Param, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { requireUser } from '../auth/require-user.js';
import { WriteDto } from './dto/write.dto.js';
import { WriteService } from './write.service.js';

@Controller('v1/write')
export class WriteController {
  constructor(private readonly writeService: WriteService) {}

  /**
   * WriteJob: project → draft → judge → text|skip.
   * Session ownership required; LLM via llm_wrapper (or stub).
   */
  @Post()
  async write(@Req() req: Request, @Body() body: WriteDto) {
    const user = await requireUser(req);
    return this.writeService.write(user.id, body);
  }

  /** Debug/audit: run trace for the actor (memory ids + judgment, not memory dump). */
  @Get('runs/:runId')
  async getRun(@Req() req: Request, @Param('runId') runId: string) {
    const user = await requireUser(req);
    const run = await this.writeService.getRun(user.id, runId);
    if (!run) {
      throw new NotFoundException('Run not found.');
    }
    return run;
  }
}
