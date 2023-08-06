import { Wrapper } from './wrapper';

export type WrapType<T extends object> = {
  get(): T;
  peek(): T;
  __keyPath: string[];
} & T;

export type DeepProxy<T> = {
  [P in keyof T]: T[P] extends object
    ? WrapType<DeepProxy<T[P]>>
    : Wrapper<T[P]>;
};
