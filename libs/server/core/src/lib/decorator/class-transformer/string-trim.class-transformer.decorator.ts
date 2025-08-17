import { applyDecorators } from '@nestjs/common';
import { Transform, TransformOptions } from 'class-transformer';

export const TransformStringTrim = (
  options?: TransformOptions & { each?: boolean },
): PropertyDecorator => {
  const { each, ...transformOptions } = options ?? {};

  return applyDecorators(
    Transform(({ value }) => {
      if (each && Array.isArray(value)) {
        return value?.map((item: string) => item.trim());
      } else {
        return value?.trim();
      }
    }, transformOptions),
  );
};
