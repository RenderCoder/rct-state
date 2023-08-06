import { get as _get } from 'lodash';
import { Wrapper } from './wrapper';
import type { DeepProxy } from './type';
import { wrapObject } from './wrapObject';

export function createDeepProxy<T extends object>(
  target: T,
  path: string[] = [],
  originalObject: T = target
): DeepProxy<T> {
  return new Proxy(target, {
    get(target, property: PropertyKey, receiver: any) {
      const keyPath = path.concat([property.toString()]);
      if (
        typeof target[property as keyof T] === 'object' &&
        target[property as keyof T] !== null
      ) {
        return wrapObject(
          createDeepProxy(
            target[property as keyof T] as any,
            path.concat([property.toString()]),
            originalObject
          ),
          keyPath,
          originalObject
        );
      }

      const value = Reflect.get(target, property, receiver); // target[property as keyof T];
      return new Wrapper(value, keyPath, originalObject);
    },
    set(target, property: PropertyKey, value: any, receiver: any) {
      return Reflect.set(target, property, value, receiver);
    },
  }) as DeepProxy<T>;
}
