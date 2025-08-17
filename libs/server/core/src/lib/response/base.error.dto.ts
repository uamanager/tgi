import { IBaseErrorDto } from '@tgi/core';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto implements IBaseErrorDto {
  @ApiProperty({
    type: Number,
    description: 'Status code',
    example: 500,
  })
  status: number;

  @ApiProperty({
    type: String,
    description: 'Name',
    example: 'InternalServerErrorException',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Message',
    example: 'Internal Server Error',
  })
  message: string;

  constructor(status: number, name: string, message: string) {
    this.status = status;
    this.name = name;
    this.message = message;
  }

  static from(err: unknown): ErrorDto[] {
    const _exception =
      err instanceof HttpException ? err : new InternalServerErrorException(err);

    const _status = _exception.getStatus();
    const _response = _exception.getResponse();

    if (typeof _response === 'object') {
      if ('message' in _response) {
        const _messages = Array.isArray(_response.message)
          ? _response.message
          : [_response.message];

        return _messages.map((message) => {
          return new ErrorDto(_status, _exception.name, message);
        });
      }

      return [new ErrorDto(_status, _exception.name, _exception.message)];
    } else {
      return [new ErrorDto(_status, _exception.name, _response ?? _exception.message)];
    }
  }
}
