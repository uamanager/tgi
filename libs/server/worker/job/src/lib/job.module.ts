import { Logger, Module } from '@nestjs/common';
import { ServerWorkerJobWatcher } from './job-watch.worker';
import { ServerDomainJobModule } from '@tgi/server-domain-job';

@Module({
  imports: [ServerDomainJobModule],
  providers: [Logger, ServerWorkerJobWatcher],
})
export class ServerWorkerJobModule {}
