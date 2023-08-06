import { get as _get } from 'lodash';
import { Wrapper } from './wrapper';
import type { DeepProxy, OnSet, OnUse } from './type';
import { wrapObject } from './wrapObject';
export type { DeepProxy } from './type';

export function createDeepProxy<T extends object>(
  target: T,
  path: string[] = [],
  originalObject: T = target,
  onSet: OnSet<T>,
  onUse: OnUse<T>
): DeepProxy<T> {
  return new Proxy(target, {
    get(target, property: PropertyKey, receiver: any) {
      const keyPath = path.concat([property.toString()]);
      if (
        typeof target[property as keyof T] === 'object' &&
        target[property as keyof T] !== null
      ) {
        return wrapObject(
          // @ts-ignore
          createDeepProxy(
            target[property as keyof T] as any,
            path.concat([property.toString()]),
            originalObject,
            onSet,
            onUse
          ),
          keyPath,
          originalObject,
          onSet,
          onUse
        );
      }

      const value = Reflect.get(target, property, receiver); // target[property as keyof T];
      return new Wrapper(value, keyPath, originalObject, onSet, onUse);
    },
    set(target, property: PropertyKey, value: any, receiver: any) {
      return Reflect.set(target, property, value, receiver);
    },
  }) as DeepProxy<T>;
}
