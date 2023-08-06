import { get as _get } from 'lodash';

export class Wrapper<T extends any> {
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
  }

  peek() {
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
}

