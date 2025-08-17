import { Logger, Module } from '@nestjs/common';
import { JobEntity, JobRunEntity } from '@tgi/core';
import {
  ServerInfraMemoryJobRepository,
  ServerInfraMemoryJobRunRepository,
} from './repository';
import { ServerInfraMemoryJobRunSchema, ServerInfraMemoryJobSchema } from './schema';

@Module({
  providers: [
    Logger,
    ServerInfraMemoryJobSchema,
    ServerInfraMemoryJobRunSchema,
    {
      provide: JobEntity,
      useExisting: ServerInfraMemoryJobSchema,
    },
    {
      provide: JobRunEntity,
      useExisting: ServerInfraMemoryJobRunSchema,
    },
    ServerInfraMemoryJobRepository,
    ServerInfraMemoryJobRunRepository,
  ],
  exports: [ServerInfraMemoryJobRepository, ServerInfraMemoryJobRunRepository],
})
export class ServerInfraMemoryJobModule {}
