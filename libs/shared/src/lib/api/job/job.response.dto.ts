import { IJobRunResponseDto } from './job-run.response.dto';
import { JobStatus } from '@tgi/core';

export interface IJobResponseDto {
  id: string;
  name: string;
  arguments: string[];
  status: JobStatus;

  maxAttempts: number;
  attempts: number;
  lastJobRun: string | null;

  jobRuns: IJobRunResponseDto[];

  createdAt: Date;
  updatedAt: Date;
}
