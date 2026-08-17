import { Injectable, NestMiddleware } from '@nestjs/common';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';

const helmetMw = helmet();

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    helmetMw(req, res, next);
  }
}
