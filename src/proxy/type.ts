import { Wrapper } from './wrapper';

// @ts-ignore eslint-disable-line react-hooks/exhaustive-deps
// // @ts-expect-error: Exported type alias 'Unwrap' has or is using private name 'U'.
export type Unwrap<T> = T extends Wrapper<infer U> ? U : T;

export type WrapType<T extends object> = {
  get(): T;
  peek(): T;
  set(value: Unwrap<T>): void;
  use(): T;
  __keyPath: string[];
} & T;

export type DeepProxy<T> = {
  [P in keyof T]: T[P] extends object
    ? WrapType<DeepProxy<T[P]>>
    : Wrapper<T[P]>;
};

export type OnSet<T extends any> = (value: T, keyPath: string[]) => void;
export type OnUse<T extends any> = (keyPath: string[]) => T;
