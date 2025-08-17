import { WorkerJob } from './worker.job';
import { Subscription } from 'rxjs';

export abstract class WorkerJobWatchdog {
  protected readonly _workerJob: WorkerJob | null = null;
  protected readonly _subscriptions = new Subscription();

  abstract init(workerJob: WorkerJob): void;

  complete() {
    this._subscriptions.unsubscribe();
  }

  protected _subscribe(...subscriptions: Subscription[]) {
    subscriptions.forEach((subscription) => this._subscriptions.add(subscription));
  }
}
