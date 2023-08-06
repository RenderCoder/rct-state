import { get as _get } from 'lodash';
import type { WrapType } from './type';

export function wrapObject<T extends object>(
  obj: T,
  keyPath: string[] = [],
  originalObject: object = {}
): WrapType<T> {
  return new Proxy(obj, {
    get(target, prop: PropertyKey, receiver: any) {
      if (prop === 'get') {
        return () => _get(originalObject, keyPath);
      }
      if (prop === 'peek') {
        return () => _get(originalObject, keyPath);
      }
      if (prop === '__keyPath') {
        return keyPath;
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as WrapType<T>;
}
