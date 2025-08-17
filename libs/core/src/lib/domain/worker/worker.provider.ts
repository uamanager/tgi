import { WorkerJob } from './worker.job';

export abstract class WorkerProvider {
  abstract get(job: string, jobRun: string): WorkerJob;

  abstract start(
    command: string,
    job: string,
    jobRun: string,
    name: string,
    args: string[],
    watchdogIdle: number,
  ): WorkerJob;

  abstract stop(job: string, jobRun: string): void;

  abstract remove(job: string, jobRun: string): void;
}
