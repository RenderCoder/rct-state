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
    get(_target, property: PropertyKey, receiver: any) {
      const keyPath = path.concat([property.toString()]);
      if (
        typeof _target[property as keyof T] === 'object' &&
        _target[property as keyof T] !== null
      ) {
        return wrapObject(
          // @ts-ignore
          createDeepProxy(
            _target[property as keyof T] as any,
            path.concat([property.toString()]),
            originalObject,
            onSet,
            onUse
          ),
          keyPath,
          originalObject,
          onSet,
          onUse,
          _target[property as keyof T]
        );
      }

      const value = Reflect.get(_target, property, receiver); // target[property as keyof T];
      return new Wrapper(value, keyPath, originalObject, onSet, onUse);
    },
    set(_target, property: PropertyKey, value: any, receiver: any) {
      return Reflect.set(_target, property, value, receiver);
    },
  }) as DeepProxy<T>;
}
