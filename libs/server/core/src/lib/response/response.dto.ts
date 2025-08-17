import { BaseResponseDto } from './base.response.dto';
import { IBaseResponseDto } from '@tgi/core';

export class ResponseDto<T> extends BaseResponseDto<T> implements IBaseResponseDto<T> {}
