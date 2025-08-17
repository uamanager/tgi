import { IMemoryRecord, MemoryChangeEventType, MemorySubject } from './memory.subject';
import { v4 as uuidv4 } from 'uuid';

export interface ISelectResult<T> {
  result: T[];
  limit: number;
  offset: number;
  total: number;
}

export class MemoryCollection<T extends IMemoryRecord> {
  protected _collection: MemorySubject<T> = new MemorySubject<T>();

  get changes$() {
    return this._collection.changes$;
  }

  async create(newRecord: Omit<T, 'id'>) {
    return await this._collection.transaction((draft) => {
      const _newId = uuidv4();
      const _newRecord: T = {
        ...newRecord,
        id: _newId,
      } as T;

      draft.set(_newId, _newRecord);
      return {
        type: MemoryChangeEventType.CREATE,
        id: _newId,
        record: _newRecord,
      };
    });
  }

  async update(id: string, patch: Partial<T>) {
    return await this._collection.transaction((draft) => {
      const _curr = draft.get(id);
      if (!_curr) {
        throw new Error(`Record ${id} not found`);
      }

      const _next = {
        ..._curr,
        ...Object.fromEntries(Object.entries(patch).filter(([_, v]) => v !== undefined)),
        id,
      } as T;
      draft.set(id, _next);
      return {
        type: MemoryChangeEventType.UPDATE,
        id,
        record: _next,
      };
    });
  }

  async delete(id: string) {
    return await this._collection.transaction((draft) => {
      const _curr = draft.get(id);
      if (!_curr) {
        throw new Error(`Record ${id} not found`);
      }

      draft.delete(id);
      return {
        type: MemoryChangeEventType.DELETE,
        id,
        record: _curr,
      };
    });
  }

  async select(
    predicate?: (record: T) => boolean,
    limit?: number,
    offset?: number,
  ): Promise<ISelectResult<T>> {
    const _limit = Math.max(0, limit ?? Number.POSITIVE_INFINITY);
    const _offset = Math.max(0, offset ?? 0);

    const _currArray = Array.from(this._collection.snapshot().values());
    const _filtered = predicate ? _currArray.filter(predicate) : _currArray;
    const _total = _filtered.length;

    if (!isFinite(_limit)) {
      return {
        result: _filtered.slice(offset),
        limit: -1,
        offset: _offset,
        total: _total,
      };
    }

    return {
      result: _filtered.slice(_offset, _offset + _limit),
      limit: _limit,
      offset: _offset,
      total: _total,
    };
  }

  async get(id: string): Promise<T | null> {
    return this._collection.snapshot().get(id) ?? null;
  }

  async count(predicate?: (record: T) => boolean): Promise<number> {
    const _currArray = Array.from(this._collection.snapshot().values());
    const _filtered = predicate ? _currArray.filter(predicate) : _currArray;
    return _filtered.length;
  }
}
