import { Logger, Module } from '@nestjs/common';
import { ServerApiJobService } from './job.api.service';
import { ServerApiJobController } from './job.api.controller';
import { ServerDomainJobModule } from '@tgi/server-domain-job';

@Module({
  imports: [ServerDomainJobModule],
  controllers: [ServerApiJobController],
  providers: [Logger, ServerApiJobService],
  exports: [],
})
export class ServerApiJobModule {}
