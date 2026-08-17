import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { requireUser } from '../auth/require-user.js';

@Controller('v1')
export class MeController {
  @Get('me')
  async getMe(@Req() req: Request) {
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
      },
    };
  }
}
