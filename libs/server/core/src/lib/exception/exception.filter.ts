import { ArgumentsHost, Catch, ExceptionFilter, Logger, Provider } from '@nestjs/common';
import { LoggerHelper } from '../common/logger/logger.helper';
import { APP_FILTER } from '@nestjs/core';
import { ResponseDto } from '../response/response.dto';
import { ErrorDto } from '../response';

export const provideExceptionFilter = (): Provider<ExceptionFilter> => {
  return {
    provide: APP_FILTER,
    useClass: ServerCoreExceptionFilter,
  };
};

@Catch()
export class ServerCoreExceptionFilter implements ExceptionFilter {
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  catch(err: Error, host: ArgumentsHost) {
    this.$_logger.fromError(err);

    const _context = host.switchToHttp();
    const _response = _context.getResponse();
    const _next = ResponseDto.fromError(ErrorDto.from(err));

    _response.status(_next.status).json(_next);
  }
}
