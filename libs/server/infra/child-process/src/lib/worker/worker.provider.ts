import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { WorkerJob, WorkerProvider } from '@tgi/core';
import { LoggerHelper } from '@tgi/server-core';
import { ServerInfraChildProcessWorkerJob } from './worker.job';
import { DefaultWorkerJobWatchdog } from './watchdog/default.watchdog';

@Injectable()
export class ServerInfraChildProcessWorkerProvider
  implements WorkerProvider, OnApplicationShutdown
{
  private readonly _workers: Map<string, WorkerJob> = new Map<string, WorkerJob>();
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  get(job: string, jobRun: string) {
    const _id = this._getId(job, jobRun);

    const _worker = this._workers.get(_id);

    if (!_worker) {
      this.$_logger.warn('Worker not found', {
        id: _id,
      });
      throw new Error('Worker not found');
    }

    return _worker;
  }

  start(
    command: string,
    job: string,
    jobRun: string,
    name: string,
    args: string[],
    watchdogIdle: number,
  ) {
    const _id = this._getId(job, jobRun);

    if (this._workers.has(_id)) {
      this.$_logger.warn('Worker already started', {
        command,
        job,
        jobRun,
        name,
      });
      throw new Error('Worker already started');
    }

    this.$_logger.log('Starting worker', {
      command,
      job,
      jobRun,
      name,
    });

    const _worker = new ServerInfraChildProcessWorkerJob(
      command,
      job,
      jobRun,
      name,
      args,
      new DefaultWorkerJobWatchdog(watchdogIdle),
    );

    this._workers.set(_id, _worker);
    _worker.start();

    return _worker;
  }

  stop(job: string, jobRun: string) {
    const _worker = this.get(job, jobRun);

    this.$_logger.log('Stopping worker', {
      command: _worker.command,
      job: _worker.job,
      jobRun: _worker.jobRun,
      name: _worker.name,
    });

    _worker.stop();
  }

  remove(job: string, jobRun: string) {
    const _id = this._getId(job, jobRun);
    const _worker = this.get(job, jobRun);

    if (!_worker.finished) {
      this.$_logger.warn('Worker should be stopped first', {
        command: _worker.command,
        job: _worker.job,
        jobRun: _worker.jobRun,
        name: _worker.name,
        exitCode: _worker.exitCode,
        pid: _worker.pid,
        killed: _worker.killed,
      });
      throw new Error('Worker should be stopped first');
    }

    this.$_logger.log('Removing worker', {
      command: _worker.command,
      job: _worker.job,
      jobRun: _worker.jobRun,
      name: _worker.name,
      exitCode: _worker.exitCode,
      pid: _worker.pid,
      killed: _worker.killed,
    });

    _worker.complete();
    this._workers.delete(_id);
  }

  onApplicationShutdown() {
    this._workers.forEach((_worker) => {
      _worker.stop();
    });
  }

  private _getId(job: string, jobRun: string) {
    return `${job}-${jobRun}`;
  }
}
