import { get as _get } from 'lodash';
import type { WrapType, OnSet, OnUse } from './type';

export function wrapObject<T extends object, P extends object>(
  obj: T,
  keyPath: string[] = [],
  originalObject: object = {},
  onSet: OnSet<T>,
  onUse: OnUse<T>,
  _: P
): WrapType<T, P> {
  return new Proxy(obj, {
    get(target, prop: PropertyKey, receiver: any) {
      switch (prop) {
        case 'get':
          return () => _get(originalObject, keyPath);
        case 'peek':
          return () => _get(originalObject, keyPath);
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
