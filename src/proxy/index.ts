import Immutable from 'immutable'
import { Wrapper } from './wrapper';
import type { DeepProxy, OnSet, OnUse } from './type';
import { wrapObject } from './wrapObject';
export type { DeepProxy } from './type';

export function createDeepProxy<T extends object>(
  target: T,
  path: string[] = [],
  originalObject: () => Immutable.Map<keyof T, T[keyof T]>,
  onSet: OnSet<T>,
  onUse: OnUse<T>
): DeepProxy<T> {
  return new Proxy(target, {
    get(_target, property: PropertyKey) {
      if (property === '__self') {
        return _target;
      }
      const keyPath = path.concat([property.toString()]);
      const realValue = originalObject().getIn(keyPath);
      if (
        typeof realValue === 'object' &&
        realValue !== null
      ) {
        return wrapObject(
          // @ts-ignore
          createDeepProxy(
            realValue as any,
            path.concat([property.toString()]),
            originalObject,
            onSet,
            onUse
          ),
          keyPath,
          originalObject,
          onSet,
          onUse,
          realValue
        );
      }

      // const value = Reflect.get(_target, property, receiver); // target[property as keyof T];
      return new Wrapper(realValue, keyPath, originalObject, onSet, onUse);
    },
    set(_target, property: PropertyKey, value: any, receiver: any) {
      return Reflect.set(_target, property, value, receiver);
    },
  }) as DeepProxy<T>;
}
