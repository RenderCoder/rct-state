import { BehaviorSubject } from 'rxjs';
import { get as _get, set as _set } from 'lodash';
import { createDeepProxy } from './proxy';
import type { DeepProxy } from './proxy';
import { use } from './hooks/use';

type Observable<T> = DeepProxy<T>;

// target: const state$ = observable({ settings: { theme: 'dark' } })

class ObserverableManager<T extends object> {
  subject: BehaviorSubject<T>;
  state$: Observable<T>;

  constructor(state: T) {
    this.subject = new BehaviorSubject(state);
    this.state$ = createDeepProxy(state, [], state, this.onSet, this.onUse);
  }

  onSet = (value: T, keyPath: string[]) => {
    this.subject.next(_set(this.subject.getValue(), keyPath, value));
  };

  onUse = (keyPath: string[]): T => {
    return use({ keyPath, subSource: this.subject });
  };
}

export function observable<T extends object>(state: T) {
  return new ObserverableManager<T>(state).state$;
}
