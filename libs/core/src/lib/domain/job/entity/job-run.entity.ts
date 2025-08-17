export enum JobRunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ERROR = 'error',
  STOPPED = 'stopped',
}

export abstract class JobRunEntity {
  id!: string; // PK

  job!: string; // FK

  attempt!: number;
  status!: JobRunStatus;

  exitCode!: number | null;
  pid!: number | null;

  startedAt!: Date;
  finishedAt!: Date | null;
  duration!: number;
}
