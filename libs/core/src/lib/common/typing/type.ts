// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
