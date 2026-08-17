import { SetMetadata } from '@nestjs/common';

/** Marks a route as publicly allowlisted (no auth required). Persona payloads still gated by isPublic. */
export const IS_PUBLIC_ROUTE = 'isPublicRoute';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_ROUTE, true);
