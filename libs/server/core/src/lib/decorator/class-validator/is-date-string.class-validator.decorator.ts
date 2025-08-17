import { buildMessage, ValidateBy } from 'class-validator';

export const IS_DATE_STRING = 'isDateString';

export function IsDateString(): PropertyDecorator {
  return ValidateBy({
    name: IS_DATE_STRING,
    constraints: [],
    validator: {
      validate: (value): boolean => {
        const [year, month, day] = value.split('-').map(Number);
        const _date = new Date(Date.UTC(year, month - 1, day));

        return !(
          _date.getFullYear() !== year ||
          _date.getMonth() + 1 !== month ||
          _date.getDate() !== day
        );
      },
      defaultMessage: buildMessage(
        (eachPrefix) => eachPrefix + '$property must be date string',
      ),
    },
  });
}
