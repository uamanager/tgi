export class ErrorMapper {
  static DEFAULT_ERROR_CASE = 'default';

  static pass = (error: Error) => error;

  static override<T, TInitialError extends Error>(
    override: T,
  ): (error: TInitialError) => T {
    return () => override;
  }

  static map<
    TInitialError extends Error,
    TMap extends Record<string, (error: TInitialError) => unknown>,
    TMapKey extends keyof TMap,
    TMapValue extends TMap[TMapKey],
  >(
    initialError: TInitialError,
    errorMapping: TMap,
  ): ReturnType<TMapValue> | TInitialError {
    if (
      initialError &&
      initialError.name &&
      Object.prototype.hasOwnProperty.call(errorMapping, initialError.name)
    ) {
      return errorMapping[initialError.name](initialError) as ReturnType<TMapValue>;
    }

    if (Object.prototype.hasOwnProperty.call(errorMapping, this.DEFAULT_ERROR_CASE)) {
      return errorMapping[this.DEFAULT_ERROR_CASE](initialError) as ReturnType<TMapValue>;
    }

    return initialError;
  }
}
