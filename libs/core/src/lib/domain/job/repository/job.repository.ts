import { JobEntity, JobStatus } from '../entity';
import { Observable } from 'rxjs';

export abstract class JobRepository {
  abstract createdOrUpdated$: Observable<JobEntity>;

  abstract get(id: string): Promise<JobEntity | null>;

  abstract search(
    name?: string,
    limit?: number,
    offset?: number,
  ): Promise<{ result: JobEntity[]; limit: number; offset: number; total: number }>;

  abstract create(
    name: string,
    job_arguments: string[],
    maxAttempts: number,
  ): Promise<JobEntity>;

  abstract update(
    id: string,
    status: JobStatus,
    attempts: number,
    lastJobRun: string,
  ): Promise<JobEntity>;
}
