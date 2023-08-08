import { Wrapper } from './wrapper';

// @ts-ignore eslint-disable-line react-hooks/exhaustive-deps
// // @ts-expect-error: Exported type alias 'Unwrap' has or is using private name 'U'.
export type Unwrap<T> = T extends Wrapper<infer U> ? U : T;

type FunctionType = (...args: any[]) => any;

type WrapTypeForNormal<P extends object> = {
  get(): P extends (...args: any[]) => infer R ? R : P;
  peek(): P extends (...args: any[]) => infer R ? R : P;
  set(value: P): void;
  use(): P;
  __keyPath: string[];
};

type WrapTypeForFunc<P extends object> = {
  get(): P extends (...args: any[]) => infer R ? R : P;
  peek(): P extends (...args: any[]) => infer R ? R : P;
  // set(value: P): void;
  use(): P;
  __keyPath: string[];
};

export type WrapType<
  T extends object,
  P extends object
> = (P extends FunctionType ? WrapTypeForFunc<P> : WrapTypeForNormal<P>) & T;

export type DeepProxy<T> = {
  [P in keyof T]: T[P] extends object
    ? WrapType<DeepProxy<T[P]>, T[P]>
    : Wrapper<T[P]>;
};

export type OnSet<T extends any> = (value: T, keyPath: string[]) => void;
export type OnUse<T extends any> = (keyPath: string[]) => T;
