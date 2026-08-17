import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { CreateApiKeyDto } from './dto/api-key.dto.js';
import { ApiKeysService } from './api-keys.service.js';

@ApiTags('api-keys')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1/api-keys')
export class ApiKeysController {
  constructor(
    private readonly apiKeys: ApiKeysService,
    private readonly authActor: AuthActorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create API key (plaintext returned once)' })
  async create(@Req() req: Request, @Body() body: CreateApiKeyDto) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.apiKeys.create(actor.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List API keys (metadata only, no secrets)' })
  async list(@Req() req: Request) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.apiKeys.list(actor.userId);
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke an API key' })
  async revoke(@Req() req: Request, @Param('id') id: string) {
    const actor = await this.authActor.requireWithScope(req, 'write');
    return this.apiKeys.revoke(actor.userId, id);
  }
}
