import { Logger, Module } from '@nestjs/common';
import { provideExceptionFilter } from './exception/exception.filter';

@Module({
  controllers: [],
  providers: [Logger, provideExceptionFilter()],
  exports: [],
})
export class ServerCoreModule {}
