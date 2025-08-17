import { LoggerService } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AccessMiddleware {
  static LOG_REQUEST_CONTEXT = 'HttpRequest';
  static LOG_RESPONSE_CONTEXT = 'HttpResponse';

  static use($_logger: LoggerService) {
    if (!$_logger) {
      throw new Error('Logger is not defined');
    }

    return (req: Request, res: Response, next: NextFunction) => {
      const _requestStart = Date.now();
      $_logger.log(`${req.method} ${req.originalUrl}`, this.LOG_REQUEST_CONTEXT);
      res.on('finish', () => {
        const _requestDuration = Date.now() - _requestStart;
        const _message = `${res.statusCode} ${req.method} ${req.originalUrl}`;

        if (res.statusCode < 400) {
          $_logger.log(
            { message: _message, status: res.statusCode, responseTime: _requestDuration },
            this.LOG_RESPONSE_CONTEXT,
          );
        } else if (res.statusCode < 500) {
          $_logger.warn(
            { message: _message, status: res.statusCode, responseTime: _requestDuration },
            this.LOG_RESPONSE_CONTEXT,
          );
        } else {
          $_logger.error(
            { message: _message, status: res.statusCode, responseTime: _requestDuration },
            this.LOG_RESPONSE_CONTEXT,
          );
        }
      });
      next();
    };
  }
}
