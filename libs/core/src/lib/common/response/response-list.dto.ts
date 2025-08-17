import { IBaseResponseDto } from './base.response.dto';
import { IResponseListPaginationDto } from './response-list-pagination.dto';

export interface IResponseListDto<T> extends IBaseResponseDto<T> {
  pagination: IResponseListPaginationDto;
}
