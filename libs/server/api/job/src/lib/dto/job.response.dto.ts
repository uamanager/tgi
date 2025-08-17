import { IJobResponseDto } from '@tgi/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobRunResponseDto } from './job-run.response.dto';
import { JobStatus } from '@tgi/core';

export class JobResponseResultDto implements IJobResponseDto {
  @ApiProperty({
    type: String,
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Job Name',
    example: 'my-task-42',
  })
  name!: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Job Arguments',
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
  arguments!: string[];

  @ApiProperty({
    type: String,
    description: 'Job Status',
    example: JobStatus.RUNNING,
    enum: JobStatus,
  })
  status!: JobStatus;

  @ApiProperty({
    type: Number,
    description: 'Maximum Allowed Retries',
    example: 3,
  })
  maxAttempts!: number;

  @ApiProperty({
    type: Number,
    description: 'Already used attempts',
    example: 1,
  })
  attempts!: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Last Job Run ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  lastJobRun!: string | null;

  @ApiProperty({
    type: () => JobRunResponseDto,
    description: 'Job Runs',
    isArray: true,
  })
  jobRuns!: JobRunResponseDto[];

  @ApiProperty({
    type: Date,
    description: 'Job Created At',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: 'Job Updated At',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
