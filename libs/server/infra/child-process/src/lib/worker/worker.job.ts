import { WorkerJob, WorkerJobWatchdog } from '@tgi/core';
import { spawn } from 'node:child_process';
import { ChildProcess } from 'child_process';
import { Subject } from 'rxjs';

export class ServerInfraChildProcessWorkerJob implements WorkerJob {
  protected _child: ChildProcess | null = null;
  protected readonly _stdout: Subject<string> = new Subject<string>();
  readonly stdout$ = this._stdout.asObservable();
  protected readonly _stderr: Subject<string> = new Subject<string>();
  readonly stderr$ = this._stderr.asObservable();
  protected readonly _onSpawn: Subject<void> = new Subject<void>();
  readonly onSpawn$ = this._onSpawn.asObservable();
  protected readonly _onExit: Subject<{
    exitCode: number | null;
    signal: string | null;
  }> = new Subject<{
    exitCode: number | null;
    signal: string | null;
  }>();
  readonly onExit$ = this._onExit.asObservable();
  protected readonly _onError: Subject<Error> = new Subject<Error>();
  readonly onError$ = this._onError.asObservable();

  constructor(
    public readonly command: string,
    public readonly job: string,
    public readonly jobRun: string,
    public readonly name: string,
    public readonly args: string[],
    protected readonly _watchdog?: WorkerJobWatchdog,
  ) {}

  protected _started = false;

  get started(): boolean {
    return this._started;
  }

  protected _running = false;

  get running(): boolean {
    return this._running;
  }

  protected _finished = false;

  get finished(): boolean {
    return this._finished;
  }

  get killed(): boolean {
    return this._child?.killed ?? false;
  }

  get pid(): number | null {
    return this._child?.pid ?? null;
  }

  get exitCode(): number | null {
    return this._child?.exitCode ?? null;
  }

  start(): void {
    if (this._started) {
      throw new Error('Child process is already running');
    }

    this._started = true;
    this._running = false;
    this._finished = false;

    this._watchdog?.init(this);

    this._child = spawn(this.command, this.args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this._child?.stdout?.on('data', (b) => this._stdout.next(b.toString()));
    this._child?.stderr?.on('data', (b) => this._stderr.next(b.toString()));

    this._child?.on('spawn', () => {
      this._started = true;
      this._running = true;
      this._finished = false;
      this._onSpawn.next();
    });
    this._child?.on('error', (error) => {
      this._started = true;
      this._running = false;
      this._finished = true;
      this._onError.next(error);
    });
    this._child?.on('exit', (exitCode, signal) => {
      this._started = true;
      this._running = false;
      this._finished = true;
      this._onExit.next({
        exitCode,
        signal,
      });
    });
  }

  stop(): void {
    if (this._child && !this.killed) {
      try {
        this._child.kill('SIGTERM');
      } catch {
        /* empty */
      }

      try {
        setTimeout(() => {
          this._child?.kill('SIGKILL');
        }, 1000).unref();
      } catch {
        /* empty */
      }
    }
  }

  complete(): void {
    this._watchdog?.complete();
    this._stdout.complete();
    this._stderr.complete();
    this._onSpawn.complete();
    this._onExit.complete();
    this._onError.complete();
  }
}
