import { JobRunStatus } from '@tgi/core';

export interface IJobRunResponseDto {
  id: string;

  job: string;

  attempt: number;
  status: JobRunStatus;

  exitCode: number | null;
  pid: number | null;

  startedAt: Date;
  finishedAt: Date | null;
  duration: number;
}
