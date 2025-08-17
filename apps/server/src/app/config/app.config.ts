import Joi from 'joi';
import { registerConfigAs } from '@tgi/server-core';
import pkg from '../../../package.json';

export interface IAppConfig {
  environment: string;
  port: number;
  logLevel: string;
  logAccess: string;
  id: string;
  name: string;
  version: string;
  description: string;
}

export default registerConfigAs<IAppConfig>(
  'app',
  {
    environment: process.env['NODE_ENV'],
    port: +(process.env['PORT'] ?? '3000'),
    logLevel: process.env['LOG_LEVEL'],
    logAccess: process.env['LOG_ACCESS'],
    id: process.env['APP_ID'],
    name: process.env['APP_NAME'],
    version: process.env['APP_VERSION'],
    description: process.env['APP_DESCRIPTION'],
  },
  Joi.object({
    environment: Joi.string().valid('development', 'production').default('production'),
    port: Joi.number().default(3000),

    logLevel: Joi.string()
      .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
      .default('silly'),

    logAccess: Joi.boolean().default(true),

    id: Joi.string().default(pkg.name),
    name: Joi.string().default(pkg.appName),
    version: Joi.string().default(pkg.version),
    description: Joi.string().default(pkg.description),
  }),
  { abortEarly: true },
);
