import { IResponseDto } from '@tgi/core';
import { IJobResponseDto } from './job.response.dto';

export interface IJobCreateResponseResultDto extends IJobResponseDto {}

export interface IJobCreateResponseDto
  extends IResponseDto<IJobCreateResponseResultDto> {}
