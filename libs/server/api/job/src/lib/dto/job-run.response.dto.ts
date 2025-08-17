import { IJobRunResponseDto } from '@tgi/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobRunStatus } from '@tgi/core';

export class JobRunResponseDto implements IJobRunResponseDto {
  @ApiProperty({
    type: String,
    description: 'Job Run ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  job!: string;

  @ApiProperty({
    type: Number,
    description: 'Job Run Attempt',
    example: 1,
  })
  attempt!: number;

  @ApiProperty({
    type: String,
    description: 'Job Run Status',
    example: JobRunStatus.RUNNING,
    enum: JobRunStatus,
  })
  status!: JobRunStatus;

  @ApiPropertyOptional({
    type: Number,
    description: 'Job Run Exit Code',
    example: 0,
  })
  exitCode!: number | null;

  @ApiPropertyOptional({
    type: Number,
    description: 'Job Run Process ID',
    example: 21312,
  })
  pid!: number | null;

  @ApiProperty({
    type: String,
    description: 'Job Run Started At',
    example: '2022-01-01T00:00:00.000Z',
  })
  startedAt!: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Job Run Finished At',
    example: '2022-01-01T00:00:00.000Z',
  })
  finishedAt!: Date | null;

  @ApiProperty({
    type: Number,
    description: 'Job Run Duration',
    example: 36000,
  })
  duration!: number;
}
