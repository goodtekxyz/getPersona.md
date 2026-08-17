import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth.js';

@Controller('v1')
export class MeController {
  @Get('me')
  async getMe(@Req() req: Request) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) {
      throw new UnauthorizedException();
    }
    const { user } = session;
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
