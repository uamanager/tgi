export function flattenObject(value: object, parentKey = ''): object {
  return Object.entries(value).reduce<object>((acc, [key, value]) => {
    const _path = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === 'object' && value.constructor === Object) {
      return {
        ...acc,
        ...flattenObject(value as object, _path),
      };
    } else {
      return {
        ...acc,
        [_path]: value,
      };
    }
  }, {});
}
