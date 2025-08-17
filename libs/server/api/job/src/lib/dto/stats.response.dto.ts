import {
  IJobStatsResponseDto,
  IJobStatsResponseResultDto,
  IJobStatsResponseResultDtoPattern,
} from '@tgi/shared';
import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '@tgi/core';
import { ResponseDto } from '@tgi/server-core';

export class JobStatsResponseDtoResultPattern
  implements IJobStatsResponseResultDtoPattern
{
  @ApiProperty({
    type: String,
    description: 'Pattern Name',
    example: 'Duration > 30s',
  })
  pattern!: string;

  @ApiProperty({
    type: Number,
    description: 'Jobs Runs Matching the Pattern',
    example: 100,
  })
  matchCount!: number;

  @ApiProperty({
    type: Number,
    description: 'Success Job Runs Matching the Pattern',
    example: 10,
  })
  successRate!: number;

  @ApiProperty({
    type: String,
    description: 'Pattern Correlation',
    example: '+10%',
  })
  differenceFromAverage!: string;
}

export class JobStatsResponseDtoResult implements IJobStatsResponseResultDto {
  @ApiProperty({
    type: Number,
    description: 'Total Jobs',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    type: Object,
    description: 'Total Jobs QTY by Status',
    example: { completed: 100 },
  })
  qtyByStatus!: Record<JobStatus, number>;

  @ApiProperty({
    type: Object,
    description: 'Total Jobs Rate by Status',
    example: { completed: 100 },
  })
  rateByStatus!: Record<JobStatus, number>;

  @ApiProperty({
    type: Number,
    description: 'Job Average Duration',
    example: 10000,
  })
  averageDuration!: number;

  @ApiProperty({
    type: Number,
    description: 'Job Average Attempts',
    example: 1,
  })
  averageAttempts!: number;

  @ApiProperty({
    type: () => JobStatsResponseDtoResultPattern,
    isArray: true,
    description: 'Jobs Runs Patterns',
  })
  patterns!: JobStatsResponseDtoResultPattern[];
}

export class JobStatsResponseDto
  extends ResponseDto<JobStatsResponseDtoResult>
  implements IJobStatsResponseDto
{
  @ApiProperty({
    type: () => JobStatsResponseDtoResult,
    description: 'Result',
  })
  override result!: JobStatsResponseDtoResult;
}
