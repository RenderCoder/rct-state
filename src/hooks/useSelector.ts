import Immutable from 'immutable';
import { useCallback, useEffect } from 'react';
import type { BehaviorSubject } from 'rxjs';
import { wrapGetterForMap } from '../proxy/immutableGetter';
import { generateSubForSpecificChange } from '../utils/subscribe';
import { useState } from './useState';
import { isImmutableObject } from '../utils/isImmutableObject';

interface UseSelectorConfig<T> {
  selectorFunction: (state: T) => any;
  subSource: BehaviorSubject<any>;
  getState: () => Immutable.Map<keyof T, T[keyof T]>;
}

export function useSelector<T extends object>({
  selectorFunction,
  subSource,
  getState,
}: UseSelectorConfig<T>) {
  const wrappedSelectorFunction = useCallback(
    (getJS: boolean = false) =>
      () => {
        const state = getState();
        const res = selectorFunction(wrapGetterForMap<T>(state));
        if (isImmutableObject(res)) {
          if (getJS) {
            return state.toJS();
          }
          return state;
        }
        return res;
      },
    [selectorFunction]
  );
  const [value, setValue] = useState(wrappedSelectorFunction(true)());
  useEffect(() => {
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: wrappedSelectorFunction(),
      mark: 'useSelector',
    }).subscribe(([_, next]) => {
      if (isImmutableObject(next)) {
        setValue(next.toJS());
      } else {
        setValue(next);
      }
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, [wrappedSelectorFunction]);

  return value;
}
