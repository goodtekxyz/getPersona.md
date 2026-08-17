import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import {
  PROMOTE_CREDENTIAL_HEADER,
  requirePromoteCredential,
} from './require-promote-credential.js';

describe('requirePromoteCredential', () => {
  const prev = process.env.PROMOTE_CREDENTIAL;

  afterEach(() => {
    if (prev === undefined) delete process.env.PROMOTE_CREDENTIAL;
    else process.env.PROMOTE_CREDENTIAL = prev;
  });

  function reqWith(header?: string): Request {
    return {
      header: (name: string) =>
        name.toLowerCase() === PROMOTE_CREDENTIAL_HEADER ? header : undefined,
    } as Request;
  }

  it('rejects missing header', () => {
    process.env.PROMOTE_CREDENTIAL = 'secret';
    expect(() => requirePromoteCredential(reqWith(undefined))).toThrow(UnauthorizedException);
  });

  it('rejects wrong credential', () => {
    process.env.PROMOTE_CREDENTIAL = 'secret';
    expect(() => requirePromoteCredential(reqWith('nope'))).toThrow(ForbiddenException);
  });

  it('accepts matching credential', () => {
    process.env.PROMOTE_CREDENTIAL = 'secret';
    expect(() => requirePromoteCredential(reqWith('secret'))).not.toThrow();
  });

  it('rejects when not configured', () => {
    delete process.env.PROMOTE_CREDENTIAL;
    expect(() => requirePromoteCredential(reqWith('secret'))).toThrow(ForbiddenException);
  });
});
