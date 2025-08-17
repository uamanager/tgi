import { IJobSearchRequestDtoQuery } from '@tgi/shared';
import { RequestPaginationDto, TransformStringTrim } from '@tgi/server-core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JobSearchRequestDtoQuery
  extends RequestPaginationDto
  implements IJobSearchRequestDtoQuery
{
  @ApiPropertyOptional({
    type: String,
    description: 'Job name',
    example: 'my-task-42',
  })
  @IsOptional()
  @IsString()
  @TransformStringTrim()
  name!: string;
}
