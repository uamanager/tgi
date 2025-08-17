import { IResponseListPaginationDto } from '@tgi/core';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseListPaginationDto implements IResponseListPaginationDto {
  @ApiProperty({
    type: Number,
    description: 'offset',
    example: 200,
  })
  offset: number;

  @ApiProperty({
    type: Number,
    description: 'Total',
    example: 200,
  })
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Limit',
    example: 50,
  })
  limit: number;

  constructor(pagination: IResponseListPaginationDto) {
    this.offset = pagination.offset;
    this.total = pagination.total;
    this.limit = pagination.limit;
  }
}
