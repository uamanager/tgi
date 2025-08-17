import { applyDecorators } from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsHexadecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export const IsId = (
  isArray:
    | boolean
    | {
        minItems?: number;
        maxItems?: number;
      } = false,
  isRequired = true,
) => {
  const _isArray = !!isArray;
  const _isArrayMinItems = typeof isArray === 'object' ? isArray.minItems : undefined;
  const _isArrayMaxItems = typeof isArray === 'object' ? isArray.maxItems : undefined;

  return applyDecorators(
    IsNotEmpty({ each: _isArray }),
    Length(24, 24, { each: _isArray }),
    IsHexadecimal({ each: _isArray }),
    ...(isArray && _isArrayMaxItems ? [ArrayMaxSize(_isArrayMaxItems)] : []),
    ...(isArray && _isArrayMinItems ? [ArrayMinSize(_isArrayMinItems)] : []),
    ...(isArray ? [IsArray(), IsString({ each: true })] : [IsString()]),
    ...(isArray
      ? [
          Transform(({ value }) => {
            return Array.isArray(value) ? value : value ? [value] : value;
          }),
        ]
      : []),
    isRequired ? IsNotEmpty() : IsOptional(),
  );
};

export const IsIdOptional = (
  isArray:
    | boolean
    | {
        minItems?: number;
        maxItems?: number;
      } = false,
) => {
  return applyDecorators(IsId(isArray, false));
};
