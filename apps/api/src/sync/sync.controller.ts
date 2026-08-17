import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { EnqueueSyncDto } from './dto/sync.dto.js';
import { SyncService } from './sync.service.js';

@ApiTags('sync')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1/sync')
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly authActor: AuthActorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Enqueue persona sync job (stub adapters)' })
  async enqueue(@Req() req: Request, @Body() body: EnqueueSyncDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.syncService.enqueue(actor.userId, {
      personaId: body.personaId,
      handles: body.handles,
    });
  }

  @Get(':jobId')
  @ApiOperation({ summary: 'Get sync job status' })
  async getJob(@Req() req: Request, @Param('jobId') jobId: string) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.syncService.getJob(actor.userId, jobId);
  }
}
