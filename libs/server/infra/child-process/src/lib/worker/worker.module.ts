import { Logger, Module } from '@nestjs/common';
import { ServerInfraChildProcessWorkerProvider } from './worker.provider';

@Module({
  providers: [Logger, ServerInfraChildProcessWorkerProvider],
  exports: [ServerInfraChildProcessWorkerProvider],
})
export class ServerInfraChildProcessWorkerModule {}
