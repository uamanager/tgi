import { NextFunction, Request, Response } from 'express';
import { RequestContext } from './request.context';

export class RequestMiddleware {
  static use() {
    return (req: Request, res: Response, next: NextFunction) => {
      RequestContext.set({
        method: req.method,
        url: req.originalUrl,
      });

      next();
    };
  }
}
