import { ObjectSchema, ValidationOptions } from 'joi';
import { registerAs } from '@nestjs/config';

export const registerConfigAs = <T extends object>(
  name: string,
  mapper: Partial<T>,
  schema: ObjectSchema<T>,
  options?: ValidationOptions,
) => {
  return registerAs(name, () => {
    const _validationResult = schema.validate(mapper, options);

    if (_validationResult.error) {
      throw new Error(`Invalid env "${name}": ${_validationResult.error.message}`);
    }

    return _validationResult.value;
  });
};
