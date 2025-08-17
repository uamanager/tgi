import { BehaviorSubject, Subject } from 'rxjs';

export interface IMemoryRecord {
  id: string;
}

export enum MemoryChangeEventType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface IMemoryChangeEvent<T extends IMemoryRecord> {
  type: MemoryChangeEventType;
  id: string;
  record: T;
}

export class MemorySubject<T extends IMemoryRecord> extends BehaviorSubject<
  ReadonlyMap<string, T>
> {
  protected _changes$: Subject<IMemoryChangeEvent<T>> = new Subject();
  changes$ = this._changes$.asObservable();
  protected _queue: Promise<void> = Promise.resolve();

  constructor() {
    super(new Map());
  }

  override get value(): never {
    throw new Error('Use dedicated methods for this subject.');
  }

  override next(_: never): never {
    throw new Error('Use dedicated methods for this subject.');
  }

  override getValue(): never {
    throw new Error('Use dedicated methods for this subject.');
  }

  override complete() {
    super.complete();
    this._changes$.complete();
  }

  async transaction(
    mutator: (
      draft: Map<string, T>,
    ) => IMemoryChangeEvent<T> | Promise<IMemoryChangeEvent<T>>,
  ) {
    return this._enqueue(async () => {
      const _curr = super.getValue();
      const _draft = new Map(_curr);
      const _change = await mutator(_draft);
      await this._commit(_draft as ReadonlyMap<string, T>, _change);
      return _change;
    });
  }

  snapshot(): Map<string, T> {
    return new Map(super.getValue());
  }

  protected async _commit(next: ReadonlyMap<string, T>, change: IMemoryChangeEvent<T>) {
    super.next(next);
    this._changes$.next(change);
  }

  protected _enqueue<R>(task: () => Promise<R> | R): Promise<R> {
    const _res = this._queue.then(() => task());

    this._queue = _res.then(
      () => Promise.resolve(),
      () => Promise.resolve(),
    );
    return _res;
  }
}
