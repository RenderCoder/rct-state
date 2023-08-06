type WrapType<T extends object> = {
  get(): T;
  peek(): T;
} & T;

type DeepProxy<T> = {
  [P in keyof T]: T[P] extends object
    ? WrapType<DeepProxy<T[P]>>
    : Wrapper<T[P]>;
};

export function wrapObject<T extends object>(obj: T): WrapType<T> {
  return new Proxy(obj, {
    get(target, prop: PropertyKey, receiver: any) {
      if (prop === 'get') {
        return () => target;
      }
      if (prop === 'peek') {
        return () => target;
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
  private proxy = new Proxy(this, {
    get(target: Wrapper<T>, property: keyof Wrapper<T>) {
      if (property in target) {
        return target[property];
      } else {
        return target.value;
      }
    },
  });
  constructor(value: any) {
    this.value = value;
    return this.proxy;
  }

  valueOf() {
    return this.value;
  }

  get() {
    return this.value;
    // return JSON.parse(stringifyWithCyclic(this.value));
  }

  peek() {
    return this.value;
    // return JSON.parse(stringifyWithCyclic(this.value));
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return JSON.stringify(this.value);
  }
}

export function createDeepProxy<T extends object>(
  target: T,
  path: string[] = []
): DeepProxy<T> {
  return new Proxy(target, {
    get(target, property: PropertyKey, receiver: any) {
      console.log(
        `Accessed property path: ${path
          .concat([property.toString()])
          .join('.')}`
      );

      if (
        typeof target[property as keyof T] === 'object' &&
        target[property as keyof T] !== null
      ) {
        return wrapObject(
          createDeepProxy(
            target[property as keyof T] as any,
            path.concat([property.toString()])
          )
        );
      }

      const value = Reflect.get(target, property, receiver); // target[property as keyof T];
      return new Wrapper(value);
    },
    set(target, property: PropertyKey, value: any, receiver: any) {
      return Reflect.set(target, property, value, receiver);
    },
  }) as DeepProxy<T>;
}
