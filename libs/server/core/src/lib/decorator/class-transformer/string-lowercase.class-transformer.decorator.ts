import { applyDecorators } from '@nestjs/common';
import { Transform, TransformOptions } from 'class-transformer';

export const TransformStringLowerCase = (
  options?: TransformOptions & { each?: boolean },
): PropertyDecorator => {
  const { each, ...transformOptions } = options ?? {};

  return applyDecorators(
    Transform(({ value }) => {
      if (each && Array.isArray(value)) {
        return value?.map((item: string) => item.toLowerCase());
      } else {
        return value?.toLowerCase();
      }
    }, transformOptions),
  );
};
