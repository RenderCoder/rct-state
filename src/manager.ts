import { BehaviorSubject } from 'rxjs';
import { set as _set } from 'lodash';
import { createDeepProxy } from './proxy';
import type { DeepProxy } from './proxy';
import { useFunc } from './hooks/use';
import { useSelector } from './hooks/useSelector';
import { useObserve } from './hooks/useObserve';

type Observable<T> = DeepProxy<T> & {
  useSelector: <R>(selector: (state: T) => R) => R;
  useObserve: <P>(
    selector: (state: T) => P,
    onChange: (value: P) => void
  ) => void;
  batch: (batchAction: () => void) => void;
};

// target: const state$ = observable({ settings: { theme: 'dark' } })

class ObserverableManager<T extends object> {
  subject: BehaviorSubject<T>;
  _state$: DeepProxy<T>;
  batchProcessing: boolean = false;

  get state$(): Observable<T> {
    return new Proxy(this._state$, {
      get: (target, property: PropertyKey, receiver: any) => {
        switch (property) {
          case 'useSelector':
            return this.useSelector;
          case 'useObserve':
            return this.useObserve;
          case 'batch':
            return this.batch;
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
    if (this.batchProcessing) {
      _set(this.subject.getValue(), keyPath, value);
      return;
    } else {
      this.subject.next(_set(this.subject.getValue(), keyPath, value));
    }
  };

  onUse = (keyPath: string[]): T => {
    return useFunc({ keyPath, subSource: this.subject });
  };

  useSelector = (selector: (state: T) => any) => {
    return useSelector({
      selectorFunction: selector,
      subSource: this.subject,
    });
  };

  useObserve = <P>(selector: (state: T) => P, onChange: (value: P) => void) => {
    useObserve<T, P>({
      selectorFunction: selector,
      subSource: this.subject,
      onChangeFunction: onChange,
    });
  };

  batch = (batchAction: () => void) => {
    this.batchProcessing = true;
    batchAction();
    this.subject.next(this.subject.getValue());
    this.batchProcessing = false;
  };
}

export function observable<T extends object>(state: T) {
  return new ObserverableManager<T>(state).state$;
}
