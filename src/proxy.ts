import { get as _get } from 'lodash';

type WrapType<T extends object> = {
  get(): T;
  peek(): T;
  keyPath: string[];
} & T;

type DeepProxy<T> = {
  [P in keyof T]: T[P] extends object
    ? WrapType<DeepProxy<T[P]>>
    : Wrapper<T[P]>;
};

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
      if (prop === 'keyPath') {
        return keyPath;
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as WrapType<T>;
}
/*
function stringifyWithCyclic(obj: any, space: number = 2): string {
  const cache = new Set();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (key === 'proxy') {
        return undefined;
      }
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // 循环引用，返回占位符字符串
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    },
    space
  );
}
//*/

class Wrapper<T extends any> {
  value: any;
  keyPath: string[] = [];
  originalObject: object = {};
  private proxy = new Proxy(this, {
    get(target: Wrapper<T>, property: keyof Wrapper<T>) {
      if (property in target) {
        return target[property];
      } else {
        return target.value;
      }
    },
  });
  constructor(value: any, keyPath: string[] = [], originalObject: object) {
    this.value = value;
    this.keyPath = keyPath;
    this.originalObject = originalObject;
    return this.proxy;
  }

  valueOf() {
    return this.value;
  }

  get() {
    return _get(this.originalObject, this.keyPath);
    // return this.keyPath;
    // return this.value;
    // return JSON.parse(stringifyWithCyclic(this.value));
  }

  peek() {
    return _get(this.originalObject, this.keyPath);
    // return this.keyPath;
    // return this.value;
    // return JSON.parse(stringifyWithCyclic(this.value));
  }

  toString() {
    return this.keyPath.join('.');
    // return this.value;
  }

  toJSON() {
    return JSON.stringify(this.keyPath);
  }
}

export function createDeepProxy<T extends object>(
  target: T,
  path: string[] = [],
  originalObject: T = target
): DeepProxy<T> {
  return new Proxy(target, {
    get(target, property: PropertyKey, receiver: any) {
      const keyPath = path.concat([property.toString()]);
      /*
      console.log(
        `Accessed property path: ${path
          .concat([property.toString()])
          .join('.')}`,
        originalObject
      );
      //*/
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
