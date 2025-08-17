import Joi from 'joi';
import { registerConfigAs } from '@tgi/server-core';

export interface IWorkerConfig {
  maxAttempts: number;
  workerCommand: string;
  workerPath: string;
  workerWatchdogIdle: number;
}

export default registerConfigAs<IWorkerConfig>(
  'worker',
  {
    maxAttempts: +(process.env['WORKER_MAX_ATTEMPTS'] ?? 2),
    workerCommand: process.env['WORKER_COMMAND'],
    workerPath: process.env['WORKER_PATH'],
    workerWatchdogIdle: +(process.env['WORKER_WATCHDOG_IDLE'] ?? 10000),
  },
  Joi.object({
    maxAttempts: Joi.number().default(2),
    workerCommand: Joi.string().default('bash'),
    workerPath: Joi.string().default('./workers/worker.sh'),
    workerWatchdogIdle: Joi.number().default(10000),
  }),
  { abortEarly: true },
);
