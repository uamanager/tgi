import Joi from 'joi';
import { registerConfigAs } from '@tgi/server-core';

export interface IApiConfig {
  prefix: string;
  defaultVersion: string;
}

export default registerConfigAs<IApiConfig>(
  'api',
  {
    prefix: process.env['API_ROOT_PREFIX'],
    defaultVersion: process.env['API_DEFAULT_VERSION'],
  },
  Joi.object({
    prefix: Joi.string().valid('api').default('api'),
    defaultVersion: Joi.string().valid('1').default('1'),
  }),
  { abortEarly: true },
);
