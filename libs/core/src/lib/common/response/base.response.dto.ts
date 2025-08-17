import { IBaseErrorDto } from './base.error.dto';

export interface IBaseResponseDto<T> {
  result: T;
  status: number;
  success: boolean;
  errors: IBaseErrorDto[];
}
