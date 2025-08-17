import { IRequestPaginationDto } from '@tgi/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class RequestPaginationDto implements IRequestPaginationDto {
  @ApiProperty({
    type: Number,
    description: 'Offset',
    example: 200,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  offset!: number;

  @ApiProperty({
    type: Number,
    description: 'Limit',
    example: 50,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(50)
  limit!: number;
}
