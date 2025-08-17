import { Injectable, Logger } from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { JobRepository, JobRunStatus, JobStatus, WorkerProvider } from '@tgi/core';
import { ConfigService } from '@nestjs/config';
import { ServerDomainJobRunService } from './job-run.service';
import { ServerDomainJobStatsService } from './job-stats.service';

@Injectable()
export class ServerDomainJobService {
  createdOrUpdated$ = this.$_jobRepository.createdOrUpdated$;

  private readonly $_logger: LoggerHelper;
  private readonly _maxAttempts: number;
  private readonly _command: string;
  private readonly _path: string;
  private readonly _watchdogIdle: number;

  constructor(
    $_logger: Logger,
    private readonly $_config: ConfigService,
    private readonly $_jobRun: ServerDomainJobRunService,
    private readonly $_jobStats: ServerDomainJobStatsService,
    private readonly $_jobRepository: JobRepository,
    private readonly $_jobWorker: WorkerProvider,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
    this._maxAttempts = this.$_config.get<number>('worker.maxAttempts', 1);
    this._command = this.$_config.get<string>('worker.workerCommand') ?? '';
    this._path = this.$_config.get<string>('worker.workerPath') ?? '';
    this._watchdogIdle = this.$_config.get<number>('worker.workerWatchdogIdle', 10000);
  }

  async searchJobs(name?: string, limit?: number, offset?: number) {
    try {
      const _jobsRes = await this.$_jobRepository.search(name, limit, offset);
      const _jobsIds = _jobsRes.result.map((_job) => _job.id);
      const _jobsRunsRes = await this.$_jobRun.searchJobRuns(..._jobsIds);

      const _mappedJobs = _jobsRes.result.map((_job) => {
        return {
          ..._job,
          jobRuns: _jobsRunsRes.filter((jobRun) => {
            return jobRun.job === _job.id;
          }),
        };
      });

      return {
        ..._jobsRes,
        result: _mappedJobs,
      };
    } catch (err) {
      this.$_logger.fromError(err, 'Error while searching jobs', {
        name,
        limit,
        offset,
      });

      throw err;
    }
  }

  async getJobsStats() {
    try {
      const _jobsRes = await this.$_jobRepository.search();
      const _jobsIds = _jobsRes.result.map((_job) => _job.id);
      const _jobsRunsRes = await this.$_jobRun.searchJobRuns(..._jobsIds);

      return this.$_jobStats.stats(_jobsRes.result, _jobsRunsRes, _jobsRes.total);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while calculating jobs stats', {});
      throw err;
    }
  }

  async createJob(name: string, job_arguments: string[] = []) {
    try {
      return await this.$_jobRepository.create(name, job_arguments, this._maxAttempts);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to create job', {
        name,
        maxAttempts: this._maxAttempts,
      });

      throw err;
    }
  }

  async createJobRun(job: string, attempt: number) {
    try {
      const _jobRun = await this.$_jobRun.createJobRun(job, attempt);

      return await this.$_jobRepository.update(
        job,
        JobStatus.PENDING,
        _jobRun.attempt,
        _jobRun.id,
      );
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to create job run', {
        job,
        attempt,
      });
      throw err;
    }
  }

  async startJobRun(job: string) {
    try {
      if (!this._path || !this._command) {
        throw new Error('Worker path or command not configured');
      }

      const _job = await this.$_jobRepository.get(job);

      if (!_job) {
        throw new Error('Job not found');
      }

      if (!_job.lastJobRun) {
        throw new Error('Job has no last job run');
      }

      const _jobRun = await this.$_jobRun.updateJobRun(
        _job.lastJobRun,
        JobRunStatus.RUNNING,
      );
      await this.$_jobRepository.update(
        job,
        JobStatus.RUNNING,
        _jobRun.attempt,
        _jobRun.id,
      );
      return this.$_jobWorker.start(
        this._command,
        job,
        _job.lastJobRun,
        _job.name,
        [this._path, ..._job.arguments],
        this._watchdogIdle,
      );
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to start job run', {
        job,
      });
      throw err;
    }
  }

  async updateJobRunPid(job: string, pid: number | null) {
    try {
      const _job = await this.$_jobRepository.get(job);

      if (!_job) {
        throw new Error('Job not found');
      }

      if (!_job.lastJobRun) {
        throw new Error('Job has no last job run');
      }

      return await this.$_jobRun.updateJobRun(
        _job.lastJobRun,
        JobRunStatus.RUNNING,
        undefined,
        pid,
      );
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to update job run pid', {
        job,
        pid,
      });
      throw err;
    }
  }

  async exitJobRun(job: string, exitCode: number | null, signal?: string | null) {
    try {
      const _job = await this.$_jobRepository.get(job);

      if (!_job) {
        throw new Error('Job not found');
      }

      if (!_job.lastJobRun) {
        throw new Error('Job has no last job run');
      }

      let _jobStatus: JobStatus;
      let _jobRunStatus: JobRunStatus;

      if (signal) {
        _jobStatus = JobStatus.STOPPED;
        _jobRunStatus = JobRunStatus.STOPPED;
      } else {
        if (exitCode === 0) {
          _jobStatus = JobStatus.COMPLETED;
          _jobRunStatus = JobRunStatus.COMPLETED;
        } else {
          _jobStatus = JobStatus.FAILED;
          _jobRunStatus = JobRunStatus.FAILED;
        }
      }

      const _jobRun = await this.$_jobRun.updateJobRun(
        _job.lastJobRun,
        _jobRunStatus,
        exitCode,
        undefined,
        new Date(),
      );

      await this.$_jobRepository.update(job, _jobStatus, _jobRun.attempt, _jobRun.id);

      this.$_jobWorker.remove(_job.id, _job.lastJobRun);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to update job on exit', {
        job,
        exitCode,
      });
      throw err;
    }
  }

  async errorJobRun(job: string) {
    try {
      const _job = await this.$_jobRepository.get(job);

      if (!_job) {
        throw new Error('Job not found');
      }

      if (!_job.lastJobRun) {
        throw new Error('Job has no last job run');
      }

      const _jobRun = await this.$_jobRun.updateJobRun(
        _job.lastJobRun,
        JobRunStatus.ERROR,
        undefined,
        undefined,
        new Date(),
      );

      await this.$_jobRepository.update(
        job,
        JobStatus.ERROR,
        _jobRun.attempt,
        _jobRun.id,
      );

      this.$_jobWorker.remove(_job.id, _job.lastJobRun);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to update job on error', {
        job,
      });
      throw err;
    }
  }
}
