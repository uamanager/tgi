import pkg from '../../../package.json';
import * as z from 'zod';
import { registerAs } from '@nestjs/config';

export const AppConfigSchema = z.object({
  environment: z.literal(['development', 'production']).optional().default('production'),
  port: z.coerce.number().gte(1024).lte(65535).optional().default(3000),
  logLevel: z
    .literal(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .optional()
    .default('silly'),
  logAccess: z.stringbool().optional().default(true),
  id: z.string().optional().default(pkg.name),
  name: z.string().optional().default(pkg.appName),
  version: z.string().optional().default(pkg.version),
  description: z.string().optional().default(pkg.description),
});

export default registerAs<z.infer<typeof AppConfigSchema>>('app', () => {
  return AppConfigSchema.parse({
    environment: process.env['NODE_ENV'],
    port: process.env['PORT'],
    logLevel: process.env['LOG_LEVEL'],
    logAccess: process.env['LOG_ACCESS'],
    id: process.env['APP_ID'],
    name: process.env['APP_NAME'],
    version: process.env['APP_VERSION'],
    description: process.env['APP_DESCRIPTION'],
  });
});
