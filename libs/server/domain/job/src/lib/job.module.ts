import { Logger, Module } from '@nestjs/common';
import { ServerDomainJobService } from './job.service';
import { ServerDomainJobRunService } from './job-run.service';
import { ServerDomainJobStatsService } from './job-stats.service';

@Module({
  controllers: [],
  providers: [
    Logger,
    ServerDomainJobService,
    ServerDomainJobRunService,
    ServerDomainJobStatsService,
  ],
  exports: [ServerDomainJobService],
})
export class ServerDomainJobModule {}
