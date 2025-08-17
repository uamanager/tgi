import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { concatMap, filter, from, Subscription, take, tap } from 'rxjs';
import { ServerDomainJobService } from '@tgi/server-domain-job';
import { JobEntity, JobStatus, WorkerJob } from '@tgi/core';

@Injectable()
export class ServerWorkerJobWatcher
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly $_logger: LoggerHelper;
  private _createdOrUpdatedSubscription: Subscription | null = null;

  constructor(
    $_logger: Logger,
    private readonly $_job: ServerDomainJobService,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  onApplicationBootstrap() {
    try {
      this._createdOrUpdatedSubscription = this.$_job.createdOrUpdated$
        .pipe(
          filter((ev) => {
            return (
              ev.attempts < ev.maxAttempts &&
              [JobStatus.NEW, JobStatus.FAILED, JobStatus.STOPPED].includes(ev.status)
            );
          }),
          concatMap((ev) => from(this.execute(ev))),
        )
        .subscribe();
    } catch (err) {
      this.$_logger.fromError(err, 'Error while initializing job watcher');
      return;
    }
  }

  onApplicationShutdown() {
    if (!this._createdOrUpdatedSubscription?.closed) {
      this._createdOrUpdatedSubscription?.unsubscribe();
    }
  }

  async execute(job: JobEntity) {
    try {
      await this.$_job.createJobRun(job.id, job.attempts + 1);
      const _worker = await this._startJob(job);

      this._onSpawn(job, _worker);
      this._onExit(job, _worker);
      this._onError(job, _worker);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while execute', {
        job: job.id,
      });

      await this.$_job.errorJobRun(job.id);
    }
  }

  private async _startJob(job: JobEntity) {
    try {
      return this.$_job.startJobRun(job.id);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while job run start', {
        job: job.id,
      });

      throw err;
    }
  }

  private _onSpawn(job: JobEntity, worker: WorkerJob) {
    worker.onSpawn$
      .pipe(
        take(1),
        concatMap(() => from(this.$_job.updateJobRunPid(job.id, worker.pid))),
      )
      .subscribe(() => {
        this.$_logger.log('Job spawned', {
          job: job.id,
          pid: worker.pid,
        });
      });
  }

  private _onExit(job: JobEntity, worker: WorkerJob) {
    worker.onExit$
      .pipe(
        take(1),
        concatMap(({ exitCode, signal }) =>
          from(this.$_job.exitJobRun(job.id, exitCode, signal)),
        ),
      )
      .subscribe(() => {
        this.$_logger.log('Job exited', {
          job: job.id,
          pid: worker.pid,
        });
      });
  }

  private _onError(job: JobEntity, worker: WorkerJob) {
    worker.onError$
      .pipe(
        take(1),
        tap((err) => {
          this.$_logger.fromError(err, 'Job errored', {
            job: job.id,
          });
        }),
        concatMap(() => from(this.$_job.errorJobRun(job.id))),
      )
      .subscribe(() => {
        this.$_logger.log('Job errored', {
          job: job.id,
          pid: worker.pid,
        });
      });
  }
}
