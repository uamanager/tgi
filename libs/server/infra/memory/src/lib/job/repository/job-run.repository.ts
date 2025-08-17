import { Inject, Injectable, Logger } from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { JobRunEntity, JobRunRepository, JobRunStatus } from '@tgi/core';
import { MemoryCollection } from '../../../db';

@Injectable()
export class ServerInfraMemoryJobRunRepository implements JobRunRepository {
  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    @Inject(JobRunEntity) private readonly _jobRunModel: MemoryCollection<JobRunEntity>,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async search(...jobs: string[]) {
    try {
      const _res = await this._jobRunModel.select((draft) => {
        return jobs.includes(draft.job);
      });

      return _res.result;
    } catch (err) {
      this.$_logger.fromError(err, 'Error while searching jobs runs');

      return [];
    }
  }

  async create(job: string, attempt: number) {
    try {
      const _res = await this._jobRunModel.create({
        job,
        attempt,
        status: JobRunStatus.PENDING,
        exitCode: null,
        pid: null,
        startedAt: new Date(),
        finishedAt: null,
        duration: 0,
      });

      return _res.record;
    } catch (err) {
      this.$_logger.fromError(err, 'Error while creating job run');
      throw err;
    }
  }

  async update(
    id: string,
    status: JobRunStatus,
    exitCode?: number | null,
    pid?: number | null,
    finishedAt?: Date,
  ) {
    try {
      const _jobRun = await this._jobRunModel.get(id);

      if (!_jobRun) {
        throw new Error('Job run not found');
      }

      const _finishedForDuration = finishedAt ?? new Date();
      const _duration =
        _finishedForDuration.getTime() - new Date(_jobRun.startedAt).getTime();

      const _res = await this._jobRunModel.update(id, {
        status,
        exitCode,
        pid,
        finishedAt,
        duration: _duration,
      });

      return _res.record;
    } catch (err) {
      this.$_logger.fromError(err, 'Error while updating job');
      throw err;
    }
  }
}
