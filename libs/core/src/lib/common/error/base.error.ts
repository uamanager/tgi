export class BaseError extends Error {
  constructor(error: Error);
  constructor(message: string);
  constructor(messageOrError: string | Error) {
    super(messageOrError instanceof Error ? messageOrError.message : messageOrError);

    if (messageOrError instanceof Error) {
      this.stack = messageOrError.stack;
    }

    this.name = this.constructor.name;
  }

  static mapContext(context: Record<string, unknown>): string {
    return Object.entries(context).reduce((acc, [key, value]) => {
      return `${acc}${acc !== '' ? ', ' : ''}${key}: '${value}'`;
    }, '');
  }
}
