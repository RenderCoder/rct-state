import Immutable from 'immutable';
import { BehaviorSubject } from 'rxjs';
import { useFunc } from './hooks/use';
import { useObserve } from './hooks/useObserve';
import { useSelector } from './hooks/useSelector';
import type { DeepProxy } from './proxy';
import { createDeepProxy } from './proxy';
import { wrapAsImmutable, wrapGetterForMap } from './proxy/immutableGetter';
import type { Unwrap } from './proxy/type';
import { generateSubForSpecificChange } from './utils/subscribe';

export type Observable<T> = DeepProxy<T> & {
  useSelector: <R>(selector: (state: T) => R) => Unwrap<R>;
  useObserve: <P>(
    selector: (state: T) => P,
    onChange: (value: Unwrap<P>) => void
  ) => void;
  batch: (batchAction: () => void) => void;
  peek: () => T;
  observe: <P>(
    selector: (state: T) => P,
    onChange: (value: P) => void
  ) => () => void;
};

// target: const state$ = observable({ settings: { theme: 'dark' } })

class ObserverableManager<T extends object> {
  private state: Immutable.Map<keyof T, T[keyof T]>;
  subject: BehaviorSubject<Immutable.Map<keyof T, T[keyof T]>>;
  _state$: DeepProxy<T>;
  batchProcessing: boolean = false;
  stateGetter: T;

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
          case 'peek':
            return this.peek;
          case 'observe':
            return this.observe;
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
    const wrappedState = wrapAsImmutable(state);
    this.state = wrappedState.mapData;
    this.stateGetter = wrappedState.getter;
    this.subject = new BehaviorSubject(this.state);
    this._state$ = createDeepProxy(
      state,
      [],
      this.state,
      this.onSet,
      this.onUse
    );
  }

  onSet = (value: T, keyPath: string[]) => {
    console.log('#onSet', { value, keyPath });
    this.state = this.state.updateIn(keyPath, () => value);
    if (this.batchProcessing) {
      return;
    } else {
      this.subject.next(this.state);
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

  peek = () => {
    return this.subject.getValue();
  };

  observe = <P>(
    selector: (state: T) => P,
    onChange: (value: P) => void
  ): (() => void) => {
    const sub = generateSubForSpecificChange({
      subject: this.subject,
      filter: () => {
        const res = selector(wrapGetterForMap(this.state));
        // console.log('#observe filter', obj, res);
        return res;
      },
    }).subscribe(([_, next]) => {
      onChange(next);
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  };
}

export function observable<T extends object>(state: T) {
  return new ObserverableManager<T>(state).state$;
}
