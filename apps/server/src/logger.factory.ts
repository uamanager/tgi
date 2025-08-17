import safeStringify from 'fast-safe-stringify';
import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { RequestContext } from '@tgi/server-core';

export const LoggerFactory = (production = false, level = 'silly', meta: object = {}) => {
  return WinstonModule.createLogger(
    production
      ? {
          transports: [
            new transports.Console({
              format: format.combine(
                format.timestamp(),
                format((info) => {
                  return {
                    ...info,
                    message: safeStringify(info.message),
                    ...RequestContext.get(),
                    ...meta,
                  };
                })(),
                format.json(),
              ),
              level,
            }),
          ],
        }
      : {
          transports: [
            new transports.Console({
              format: format.combine(
                format.timestamp(),
                format((info) => {
                  return {
                    ...info,
                    ...RequestContext.get(),
                    ...meta,
                  };
                })(),
                utilities.format.nestLike(),
              ),
              level,
            }),
          ],
        },
  );
};
