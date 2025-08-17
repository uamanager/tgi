export enum JobStatus {
  NEW = 'new',
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ERROR = 'error',
  STOPPED = 'stopped',
}

export abstract class JobEntity {
  id!: string; // PK

  name!: string;
  arguments!: string[];

  status!: JobStatus;

  maxAttempts!: number;
  attempts!: number;
  lastJobRun!: string | null; // FK

  createdAt!: Date;
  updatedAt!: Date;
}
