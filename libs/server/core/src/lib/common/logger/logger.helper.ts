import { Logger, LoggerService } from '@nestjs/common';
import fastSafeStringify from 'fast-safe-stringify';

export class LoggerHelper implements LoggerService {
  constructor(
    private readonly _logger: Logger,
    private readonly _caller: string,
  ) {}

  static create(logger: Logger, caller: string): LoggerHelper {
    return new LoggerHelper(logger, caller);
  }

  log(message: string, context: Record<string, unknown> = {}) {
    this._logger.log(`${message}${this._mapContext(context)}`, this._caller);
  }

  fromError(error: unknown, message?: string, context: Record<string, unknown> = {}) {
    if (error && error instanceof Error) {
      this._logger.error(
        `${error?.name ?? 'Error'}: ${error?.message} ${message ?? ''}${this._mapContext(
          context,
        )}`,
        error?.stack,
        this._caller,
      );
    } else {
      const _error = new Error(message ?? 'Unknown Error');
      this._logger.error(
        `Unexpected Error: ${_error.message}${this._mapContext(context)}`,
        _error.stack,
        this._caller,
      );
    }
  }

  error(message: string, context: Record<string, unknown> = {}) {
    this._logger.error(`${message} ${this._mapContext(context)}`, '', this._caller);
  }

  warn(message: string, context: Record<string, unknown> = {}) {
    this._logger.warn(`${message} ${this._mapContext(context)}`, this._caller);
  }

  debug(message: string, context: Record<string, unknown> = {}) {
    this._logger.debug(`${message} ${this._mapContext(context)}`, this._caller);
  }

  verbose(message: string, context: Record<string, unknown> = {}) {
    this._logger.verbose(`${message} ${this._mapContext(context)}`, this._caller);
  }

  protected _mapContext(context: Record<string, unknown>): string {
    if (!context) {
      return '';
    }
    return ' ' + fastSafeStringify(context);
  }
}
