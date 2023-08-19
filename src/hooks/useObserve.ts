import Immutable from 'immutable';
import { useEffect } from 'react';
import type { BehaviorSubject } from 'rxjs';
import { wrapGetterForMap } from '../proxy/immutableGetter';
import { generateSubForSpecificChange } from '../utils/subscribe';

interface UseObserveConfig<T, P = any> {
  selectorFunction: (state: T) => P;
  subSource: BehaviorSubject<any>;
  onChangeFunction: (value: P) => void;
  getState: () => Immutable.Map<keyof T, T[keyof T]>;
}

export function useObserve<T extends object, P>({
  selectorFunction,
  subSource,
  onChangeFunction,
  getState,
}: UseObserveConfig<T, P>) {
  useEffect(() => {
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: () => {
        return selectorFunction(wrapGetterForMap<T>(getState()));
      },
      mark: 'useObserve'
    }).subscribe(([_, next]) => {
      onChangeFunction(next);
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, []);
}
