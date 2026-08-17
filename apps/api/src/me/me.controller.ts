import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthActorService } from '../auth/auth-actor.service.js';
import { requireUser } from '../auth/require-user.js';

@ApiTags('me')
@ApiBearerAuth('bearer')
@ApiCookieAuth('session')
@Controller('v1')
export class MeController {
  constructor(private readonly authActor: AuthActorService) {}

  @Get('me')
  @ApiOperation({ summary: 'Current actor (session user or API key owner)' })
  async getMe(@Req() req: Request) {
    const actor = await this.authActor.require(req);
    if (actor.authType === 'api_key') {
      return {
        user: {
          id: actor.userId,
          authType: 'api_key' as const,
          scopes: [...actor.scopes],
          apiKeyId: actor.apiKeyId,
        },
      };
    }
    const user = await requireUser(req);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        authType: 'session' as const,
        scopes: [...actor.scopes],
      },
    };
  }
}
