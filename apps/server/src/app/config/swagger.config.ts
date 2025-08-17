import Joi from 'joi';
import { registerConfigAs } from '@tgi/server-core';

export interface ISwaggerConfig {
  enabled: boolean;
  prefix: string;
}

export default registerConfigAs<ISwaggerConfig>(
  'swagger',
  {
    enabled: (process.env['SWAGGER_ENABLED'] ?? 'true') === 'true',
    prefix: process.env['SWAGGER_ROOT_PREFIX'],
  },
  Joi.object({
    enabled: Joi.boolean().default(true),
    prefix: Joi.string().valid('docs').default('docs'),
  }),
  { abortEarly: true },
);
