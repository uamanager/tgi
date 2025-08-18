import * as z from 'zod';
import { registerAs } from '@nestjs/config';

export const ApiConfigSchema = z.object({
  prefix: z.string().min(1).max(100).optional().default('api'),
  defaultVersion: z.string().regex(/^\d+$/).optional().default('1'),
});

export default registerAs<z.infer<typeof ApiConfigSchema>>('api', () => {
  return ApiConfigSchema.parse({
    prefix: process.env['API_ROOT_PREFIX'],
    defaultVersion: process.env['API_DEFAULT_VERSION'],
  });
});
