import { Observable } from 'rxjs';
import { WorkerJobWatchdog } from './worker.watchdog';

export abstract class WorkerJob {
  abstract readonly killed: boolean;
  abstract readonly pid: number | null;
  abstract readonly exitCode: number | null;

  abstract readonly started: boolean;
  abstract readonly running: boolean;
  abstract readonly finished: boolean;

  abstract readonly stdout$: Observable<string>;
  abstract readonly stderr$: Observable<string>;

  abstract readonly onSpawn$: Observable<void>;
  abstract readonly onExit$: Observable<{
    exitCode: number | null;
    signal: string | null;
  }>;
  abstract readonly onError$: Observable<Error>;

  constructor(
    public readonly command: string,
    public readonly job: string,
    public readonly jobRun: string,
    public readonly name: string,
    public readonly args: string[],
    protected readonly watchdog?: WorkerJobWatchdog,
  ) {}

  abstract start(): void;
  abstract stop(): void;
  abstract complete(): void;
}
