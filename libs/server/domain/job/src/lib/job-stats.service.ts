import { Injectable, Logger } from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { JobEntity, JobRunEntity, JobStatus } from '@tgi/core';

@Injectable()
export class ServerDomainJobStatsService {
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async stats(jobs: JobEntity[], jobRuns: JobRunEntity[], total: number) {
    const _runsByJob = this._groupJobRunsByJob(jobs, jobRuns);
    const _completed = jobs.filter((job) => job.status === JobStatus.COMPLETED);
    const _completedRate = _completed.length / total || 0;

    const _averageAttempts =
      _completed.reduce((accum, curr) => (accum += curr.attempts), 0) /
        _completed.length || 0;

    const _averageDuration =
      jobRuns.reduce((accum, curr) => (accum += curr.duration), 0) / jobRuns.length || 0;

    const _byStatus = Object.entries(JobStatus).reduce(
      (accum, [, value]) => {
        const _qty = jobs.filter((job) => job.status === value).length;

        return {
          qty: {
            ...accum.qty,
            [value]: _qty,
          },
          rate: {
            ...accum.rate,
            [value]: _qty / total || 0,
          },
        };
      },
      {
        qty: {} as Record<JobStatus, number>,
        rate: {} as Record<JobStatus, number>,
      },
    );

    return {
      total,
      qtyByStatus: _byStatus.qty,
      rateByStatus: _byStatus.rate,
      averageDuration: _averageDuration,
      averageAttempts: _averageAttempts,
      patterns: [
        this._preparePattern('--result=auto', jobs, _runsByJob, _completedRate, (job) => {
          const _resIndex = job.arguments.indexOf('--result');
          const _autoIndex = job.arguments.indexOf('auto');

          return _resIndex > -1 && _autoIndex > -1 && _autoIndex === _resIndex + 1;
        }),

        this._preparePattern(
          'Duration > 30s',
          jobs,
          _runsByJob,
          _completedRate,
          (job, runs) => {
            const _runDurations = runs
              .map((run) => run.duration)
              .filter((duration) => duration > 0);

            return (
              (_runDurations.reduce((accum, curr) => (accum += curr), 0) /
                _runDurations.length || 0) > 30000
            );
          },
        ),

        this._preparePattern(
          '--print-progress=yes',
          jobs,
          _runsByJob,
          _completedRate,
          (job) => {
            const _progressIndex = job.arguments.indexOf('--print-progress');
            const _yesIndex = job.arguments.indexOf('yes');

            return (
              _progressIndex > -1 && _yesIndex > -1 && _yesIndex === _progressIndex + 1
            );
          },
        ),
      ],
    };
  }

  private _groupJobRunsByJob(jobs: JobEntity[], jobRuns: JobRunEntity[]) {
    return jobs.reduce(
      (accum, curr) => {
        return {
          ...accum,
          [curr.id]: jobRuns.filter((jobRun) => jobRun.job === curr.id),
        };
      },
      {} as Record<string, JobRunEntity[]>,
    );
  }

  private _preparePattern(
    pattern: string,
    jobs: JobEntity[],
    runsByJob: Record<string, JobRunEntity[]>,
    successRate: number,
    predicate: (job: JobEntity, runs: JobRunEntity[]) => boolean,
  ) {
    const _patternMatched = jobs.filter((j) => predicate(j, runsByJob[j.id] || []));
    const _patternMatchedCompleted = _patternMatched.filter(
      (job) => job.status === JobStatus.COMPLETED,
    ).length;
    const _patternSuccessRate = _patternMatchedCompleted / _patternMatched.length || 0;
    const _patternDiff = _patternSuccessRate - successRate;

    return {
      pattern,
      matchCount: _patternMatched.length,
      successRate: _patternSuccessRate,
      differenceFromAverage: `${_patternDiff >= 0 ? '+' : ''}${Math.round(_patternDiff * 100)}%`,
    };
  }
}
