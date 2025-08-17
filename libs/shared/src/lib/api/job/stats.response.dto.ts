import { IResponseDto, JobStatus } from '@tgi/core';

export interface IJobStatsResponseResultDtoPattern {
  pattern: string;
  matchCount: number;
  successRate: number;
  differenceFromAverage: string;
}

export interface IJobStatsResponseResultDto {
  total: number;
  qtyByStatus: Record<JobStatus, number>;
  rateByStatus: Record<JobStatus, number>;
  averageDuration: number;
  averageAttempts: number;
  patterns: IJobStatsResponseResultDtoPattern[];
}

export interface IJobStatsResponseDto extends IResponseDto<IJobStatsResponseResultDto> {}
