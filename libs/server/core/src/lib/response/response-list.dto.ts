import { BaseResponseDto } from './base.response.dto';
import { IResponseListDto, IResponseListPaginationDto } from '@tgi/core';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseListPaginationDto } from './response-list-pagination.dto';

export class ResponseListDto<T>
  extends BaseResponseDto<T>
  implements IResponseListDto<T>
{
  @ApiProperty({
    type: () => ResponseListPaginationDto,
    description: 'Pagination Details',
    isArray: true,
  })
  pagination: ResponseListPaginationDto;

  constructor(response: IResponseListDto<T>) {
    super(response);
    this.pagination = response.pagination;
  }

  static override fromResult<T>(result: T, pagination?: IResponseListPaginationDto) {
    return new this<T>({
      result,
      status: 200,
      success: true,
      errors: [],
      pagination:
        pagination ??
        new ResponseListPaginationDto({
          offset: 0,
          total: 0,
          limit: 0,
        }),
    });
  }

  withPagination(total: number, limit: number, offset: number) {
    this.pagination = new ResponseListPaginationDto({
      total,
      limit,
      offset,
    });

    return this;
  }
}
