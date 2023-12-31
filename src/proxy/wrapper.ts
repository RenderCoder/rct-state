import { get as _get } from 'lodash';
import type { OnSet, OnUse } from './type';

export class Wrapper<T extends any> {
  value: any;
  keyPath: string[] = [];
  originalObject: object = {};
  onSet: OnSet<T>;
  onUse: OnUse<T>;
  private proxy = new Proxy(this, {
    get(target: Wrapper<T>, property: keyof Wrapper<T>) {
      if (property in target) {
        return target[property];
      } else {
        return target.value;
      }
    },
  });
  constructor(
    value: any,
    keyPath: string[] = [],
    originalObject: object,
    onSet: OnSet<T>,
    onUse: OnUse<T>
  ) {
    this.value = value;
    this.keyPath = keyPath;
    this.originalObject = originalObject;
    this.onSet = onSet;
    this.onUse = onUse;
    return this.proxy;
  }

  valueOf() {
    return this.value;
  }

  get(): T {
    return _get(this.originalObject, this.keyPath);
  }

  peek(): T {
    return _get(this.originalObject, this.keyPath);
  }

  get __keyPath() {
    return this.keyPath;
  }

  toString() {
    return this.keyPath.join('.');
    // return this.value;
  }

  toJSON() {
    return JSON.stringify(this.keyPath);
  }

  set(value: T) {
    this.onSet(value, this.keyPath);
  }

  use() {
    return this.onUse(this.keyPath);
  }
}
