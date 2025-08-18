import * as z from 'zod';
import { registerAs } from '@nestjs/config';

export const SwaggerConfigSchema = z.object({
  enabled: z.stringbool().optional().default(true),
  prefix: z.string().min(1).max(100).optional().default('docs'),
});

export default registerAs<z.infer<typeof SwaggerConfigSchema>>('swagger', () => {
  return SwaggerConfigSchema.parse({
    enabled: process.env['SWAGGER_ENABLED'],
    prefix: process.env['SWAGGER_ROOT_PREFIX'],
  });
});
