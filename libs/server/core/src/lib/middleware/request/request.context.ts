import { ClsServiceManager } from 'nestjs-cls';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface IRequestContext {
  id: string;
  method: string;
  url: string;
}

export class RequestContext {
  static CONTEXT_KEY = 'request' as const;

  protected static _cls = ClsServiceManager.getClsService();

  static generateId(req: Request): string {
    return (req.headers['X-Request-Id'] as string) ?? uuidv4();
  }

  static set(context: Omit<IRequestContext, 'id'>): void {
    this._cls.set(RequestContext.CONTEXT_KEY, context);
  }

  static get(): IRequestContext {
    const _id = this._cls.getId();
    const _context = this._cls.get(RequestContext.CONTEXT_KEY) ?? {};

    return { id: _id, ..._context };
  }
}
