import { IRequestPaginationDto } from '@tgi/core';

export interface IJobSearchRequestDtoQuery extends IRequestPaginationDto {
  name: string;
}
