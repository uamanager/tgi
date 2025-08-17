import { Injectable, Logger } from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { JobRunRepository, JobRunStatus } from '@tgi/core';

@Injectable()
export class ServerDomainJobRunService {
  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    private readonly $_jobRunRepository: JobRunRepository,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async searchJobRuns(...jobs: string[]) {
    try {
      return await this.$_jobRunRepository.search(...jobs);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while searching jobs runs', {
        jobs,
      });

      throw err;
    }
  }

  async createJobRun(job: string, attempt: number) {
    try {
      return await this.$_jobRunRepository.create(job, attempt);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to create job run', {
        job,
        attempt,
      });

      throw err;
    }
  }

  async updateJobRun(
    id: string,
    status: JobRunStatus,
    exitCode?: number | null,
    pid?: number | null,
    finishedAt?: Date,
  ) {
    try {
      return await this.$_jobRunRepository.update(id, status, exitCode, pid, finishedAt);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to update job run', {
        id,
        status,
        exitCode,
        pid,
        finishedAt,
      });

      throw err;
    }
  }
}
