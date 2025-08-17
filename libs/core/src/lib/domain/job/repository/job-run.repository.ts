import { JobRunEntity, JobRunStatus } from '../entity';

export abstract class JobRunRepository {
  abstract search(...jobs: string[]): Promise<JobRunEntity[]>;

  abstract create(job: string, attempt: number): Promise<JobRunEntity>;

  abstract update(
    id: string,
    status: JobRunStatus,
    exitCode?: number | null,
    pid?: number | null,
    finishedAt?: Date,
  ): Promise<JobRunEntity>;
}
