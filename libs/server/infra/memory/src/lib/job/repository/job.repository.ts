import { Inject, Injectable, Logger } from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { JobEntity, JobRepository, JobStatus } from '@tgi/core';
import { MemoryChangeEventType, MemoryCollection } from '../../../db';
import { concatMap, filter, from } from 'rxjs';

@Injectable()
export class ServerInfraMemoryJobRepository implements JobRepository {
  createdOrUpdated$ = this._jobModel.changes$.pipe(
    filter((ev) => {
      return (
        ev.type === MemoryChangeEventType.CREATE ||
        ev.type === MemoryChangeEventType.UPDATE
      );
    }),
    concatMap((ev) => {
      return from(this._jobModel.get(ev.id));
    }),
    filter((job) => {
      return job !== null;
    }),
  );

  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    @Inject(JobEntity) private readonly _jobModel: MemoryCollection<JobEntity>,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async get(id: string) {
    try {
      return await this._jobModel.get(id);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while getting job');
      throw err;
    }
  }

  async search(name?: string, limit?: number, offset?: number) {
    try {
      const _predicate = name
        ? (draft: JobEntity) => {
            return draft.name === name;
          }
        : undefined;

      return await this._jobModel.select(_predicate, limit, offset);
    } catch (err) {
      this.$_logger.fromError(err, 'Error while searching jobs');

      return {
        result: [],
        limit: limit ?? 0,
        offset: offset ?? 0,
        total: 0,
      };
    }
  }

  async create(name: string, job_arguments: string[], maxAttempts: number) {
    try {
      const _res = await this._jobModel.create({
        name,
        arguments: job_arguments,
        status: JobStatus.NEW,
        maxAttempts,
        attempts: 0,
        lastJobRun: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return _res.record;
    } catch (err) {
      this.$_logger.fromError(err, 'Error while creating job');
      throw err;
    }
  }

  async update(id: string, status: JobStatus, attempts: number, lastJobRun: string) {
    try {
      const _res = await this._jobModel.update(id, {
        status,
        attempts,
        lastJobRun,
        updatedAt: new Date(),
      });

      return _res.record;
    } catch (err) {
      this.$_logger.fromError(err, 'Error while updating job');
      throw err;
    }
  }
}
