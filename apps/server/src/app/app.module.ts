import { Logger, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import apiConfig from './config/api.config';
import swaggerConfig from './config/swagger.config';
import workerConfig from './config/worker.config';
import { ClsModule } from 'nestjs-cls';
import { APP_GUARD } from '@nestjs/core';
import { ServerCoreInfraHostModule, ServerCoreModule } from '@tgi/server-core';
import { JobRepository, JobRunRepository, WorkerProvider } from '@tgi/core';
import { ServerDomainJobModule } from '@tgi/server-domain-job';
import { ServerApiJobModule } from '@tgi/server-api-job';
import {
  ServerInfraMemoryJobModule,
  ServerInfraMemoryJobRepository,
  ServerInfraMemoryJobRunRepository,
} from '@tgi/server-infra-memory';
import { ServerWorkerJobModule } from '@tgi/server-worker-job';
import {
  ServerInfraChildProcessWorkerModule,
  ServerInfraChildProcessWorkerProvider,
} from '@tgi/server-infra-child-process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [apiConfig, appConfig, swaggerConfig, workerConfig],
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 5,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    ClsModule.forRoot(),

    // CORE
    ServerCoreModule,

    // INFRA
    ServerCoreInfraHostModule.register(
      {
        imports: [ServerInfraMemoryJobModule],
        providers: [
          {
            provide: JobRepository,
            useExisting: ServerInfraMemoryJobRepository,
          },
          {
            provide: JobRunRepository,
            useExisting: ServerInfraMemoryJobRunRepository,
          },
        ],
      },
      {
        imports: [ServerInfraChildProcessWorkerModule],
        providers: [
          {
            provide: WorkerProvider,
            useExisting: ServerInfraChildProcessWorkerProvider,
          },
        ],
      },
    ),

    // DOMAIN
    ServerDomainJobModule,

    // API
    ServerApiJobModule,

    // WORKER
    ServerWorkerJobModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
