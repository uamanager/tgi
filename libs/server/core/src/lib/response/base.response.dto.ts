import { IBaseErrorDto, IBaseResponseDto } from '@tgi/core';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from './base.error.dto';

export class BaseResponseDto<T> implements IBaseResponseDto<T> {
  @ApiProperty({
    description: 'Result',
  })
  result: T;

  @ApiProperty({
    type: Number,
    description: 'Status code',
    example: 200,
  })
  status: number;

  @ApiProperty({
    type: Boolean,
    description: 'Is successful?',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: () => ErrorDto,
    description: 'Errors list',
    isArray: true,
  })
  errors: ErrorDto[];

  constructor(response: IBaseResponseDto<T>) {
    this.result = response.result;
    this.status = response.status ?? 200;
    this.success = response.success ?? true;
    this.errors = response.errors || [];
  }

  static fromResult<T>(result: T) {
    return new this<T>({
      result,
      status: 200,
      success: true,
      errors: [],
    });
  }

  static fromError(error: IBaseErrorDto | IBaseErrorDto[]) {
    return this.fromResult<null>(null).withError(error);
  }

  withError(error: IBaseErrorDto | IBaseErrorDto[]) {
    this.errors = [...this.errors, ...(Array.isArray(error) ? error : [error])];
    this.success = !this.errors.length;
    this.status = Math.max(...this.errors.map((err) => err.status));

    return this;
  }
}
