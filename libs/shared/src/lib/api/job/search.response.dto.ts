import { IResponseListDto } from '@tgi/core';
import { IJobResponseDto } from './job.response.dto';

export interface IJobSearchResponseResultDto extends IJobResponseDto {}

export interface IJobSearchResponseDto
  extends IResponseListDto<IJobSearchResponseResultDto[]> {}
