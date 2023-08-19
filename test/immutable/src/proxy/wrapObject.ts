import Immutable from 'immutable';
import type { OnSet, OnUse, WrapType } from './type';

export function wrapObject<T extends object, P extends object>(
  obj: T,
  keyPath: string[] = [],
  originalObject: Immutable.Map<keyof T, T[keyof T]>,
  onSet: OnSet<T>,
  onUse: OnUse<T>,
  _: P
): WrapType<T, P> {
  return new Proxy(obj, {
    get(target, prop: PropertyKey, receiver: any) {
      switch (prop) {
        case 'get':
          return () => originalObject.getIn(keyPath);
        case 'peek':
          return () => originalObject.getIn(keyPath);
        case 'set':
          return (value: T) => {
            onSet && onSet(value, keyPath);
          };
        case 'use':
          return (): T => {
            return onUse(keyPath);
          };
        case '__keyPath':
          return keyPath;
        default:
          return Reflect.get(target, prop, receiver);
      }
    },
  }) as WrapType<T, P>;
}
