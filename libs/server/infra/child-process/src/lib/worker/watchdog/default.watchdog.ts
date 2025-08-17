import { WorkerJob, WorkerJobWatchdog } from '@tgi/core';
import { merge, startWith, switchMap, takeUntil, timer } from 'rxjs';

export class DefaultWorkerJobWatchdog extends WorkerJobWatchdog {
  constructor(protected readonly _idle: number) {
    super();
  }

  init(workerJob: WorkerJob): void {
    const _done$ = merge(workerJob.onError$, workerJob.onExit$);

    const _sub = merge(workerJob.stdout$, workerJob.stderr$)
      .pipe(startWith('init'))
      .pipe(
        switchMap(() => timer(this._idle)),
        takeUntil(_done$),
      )
      .subscribe(() => {
        try {
          workerJob.stop();
        } catch {
          /* empty */
        }
      });

    this._subscribe(
      _sub,
      _done$.subscribe(() => this.complete()),
    );
  }
}
