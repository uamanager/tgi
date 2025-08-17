import { TransformStringTrim } from '@tgi/server-core';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IJobCreateRequestDtoBody } from '@tgi/shared';

export class JobCreateRequestDtoBody implements IJobCreateRequestDtoBody {
  @ApiProperty({
    type: String,
    description: 'Job name',
    example: 'my-task-42',
  })
  @IsString()
  @TransformStringTrim()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Job arguments',
    example: [
      '--result',
      'auto',
      '--duration',
      '100',
      '--print-start',
      'auto',
      '--print-progress',
      'auto',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @TransformStringTrim({ each: true })
  @IsNotEmpty({ each: true })
  arguments?: string[];
}
