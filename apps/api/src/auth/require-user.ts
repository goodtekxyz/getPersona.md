import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';

export async function requireSession(req: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session?.user) {
    throw new UnauthorizedException();
  }
  return session;
}

export async function requireUser(req: Request) {
  const session = await requireSession(req);
  return session.user;
}
