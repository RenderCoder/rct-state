import { BehaviorSubject } from 'rxjs';
import { get as _get, set as _set } from 'lodash';
import { createDeepProxy } from './proxy';
import type { DeepProxy } from './proxy';
import { use } from './hooks/use';
import { useSelector } from './hooks/useSelector';

type Observable<T> = DeepProxy<T> & {
  useSelector: <R>(selector: (state: T) => R) => R;
};

// target: const state$ = observable({ settings: { theme: 'dark' } })

class ObserverableManager<T extends object> {
  subject: BehaviorSubject<T>;
  _state$: DeepProxy<T>;
  get state$(): Observable<T> {
    return new Proxy(this._state$, {
      get: (target, property: PropertyKey, receiver: any) => {
        switch (property) {
          case 'useSelector':
            return this.useSelector;
          default:
            return Reflect.get(target, property, receiver);
        }
      },
      set: () => {
        return false;
      },
    }) as Observable<T>;
  }

  constructor(state: T) {
    this.subject = new BehaviorSubject(state);
    this._state$ = createDeepProxy(state, [], state, this.onSet, this.onUse);
  }

  onSet = (value: T, keyPath: string[]) => {
    this.subject.next(_set(this.subject.getValue(), keyPath, value));
  };

  onUse = (keyPath: string[]): T => {
    return use({ keyPath, subSource: this.subject });
  };

  useSelector = (selector: (state: T) => any) => {
    return useSelector({
      selectorFunction: selector,
      subSource: this.subject,
    });
  };
}

export function observable<T extends object>(state: T) {
  return new ObserverableManager<T>(state).state$;
}
