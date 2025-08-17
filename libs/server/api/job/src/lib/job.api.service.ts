import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LoggerHelper } from '@tgi/server-core';
import { ServerDomainJobService } from '@tgi/server-domain-job';
import { JobCreateRequestDtoBody } from './dto/create.request.dto';
import { JobSearchRequestDtoQuery } from './dto/search.request.dto';
import { JobSearchResponseDto } from './dto/search.response.dto';
import { JobCreateResponseDto } from './dto/create.response.dto';
import { ErrorMapper } from '@tgi/core';
import { JobStatsResponseDto } from './dto/stats.response.dto';

@Injectable()
export class ServerApiJobService {
  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    private readonly $_job: ServerDomainJobService,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async search(query: JobSearchRequestDtoQuery) {
    try {
      const _jobsRes = await this.$_job.searchJobs(query.name, query.limit, query.offset);

      return JobSearchResponseDto.fromResult(_jobsRes.result, {
        total: _jobsRes.total,
        limit: _jobsRes.limit,
        offset: _jobsRes.offset,
      });
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to search jobs', {
        name: query.name,
        limit: query.limit,
        offset: query.offset,
      });

      throw ErrorMapper.map(err as Error, {
        [ErrorMapper.DEFAULT_ERROR_CASE]: ErrorMapper.override(
          new NotFoundException('Unable to search jobs.'),
        ),
      });
    }
  }

  async create(body: JobCreateRequestDtoBody) {
    try {
      const _job = await this.$_job.createJob(body.name, body.arguments);

      return JobCreateResponseDto.fromResult({
        ..._job,
        jobRuns: [],
      });
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to create job', {
        name: body.name,
      });

      throw ErrorMapper.map(err as Error, {
        [ErrorMapper.DEFAULT_ERROR_CASE]: ErrorMapper.override(
          new BadRequestException('Unable to create job.'),
        ),
      });
    }
  }

  async stats() {
    try {
      const _statsRes = await this.$_job.getJobsStats();

      return JobStatsResponseDto.fromResult(_statsRes);
    } catch (err) {
      this.$_logger.fromError(err, 'Unable to calculate stats', {});

      throw ErrorMapper.map(err as Error, {
        [ErrorMapper.DEFAULT_ERROR_CASE]: ErrorMapper.override(
          new BadRequestException('Unable to calculate stats.'),
        ),
      });
    }
  }
}
