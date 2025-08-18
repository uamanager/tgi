import * as z from 'zod';
import { registerAs } from '@nestjs/config';

export const WorkerConfigSchema = z.object({
  maxAttempts: z.coerce.number().gte(1).lte(100).optional().default(2),
  workerCommand: z.string().min(1).optional().default('bash'),
  workerPath: z.string().min(1).optional().default('./workers/worker.sh'),
  workerWatchdogIdle: z.coerce.number().gte(1000).optional().default(10000),
});

export default registerAs<z.infer<typeof WorkerConfigSchema>>('worker', () => {
  return WorkerConfigSchema.parse({
    maxAttempts: process.env['WORKER_MAX_ATTEMPTS'],
    workerCommand: process.env['WORKER_COMMAND'],
    workerPath: process.env['WORKER_PATH'],
    workerWatchdogIdle: process.env['WORKER_WATCHDOG_IDLE'],
  });
});
