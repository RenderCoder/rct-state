import { useEffect } from 'react';
import { useState } from './useState';
import type { BehaviorSubject } from 'rxjs';
import Immutable from 'immutable';
import { generateSubForSpecificChange } from '../utils/subscribe';

interface UseConfig<T> {
  keyPath: string[];
  subSource: BehaviorSubject<Immutable.Map<keyof T, T[keyof T]>>;
  getState: () => Immutable.Map<keyof T, T[keyof T]>;
}

export function useFunc<T>({ keyPath, subSource, getState }: UseConfig<T>) {
  const [value, setValue] = useState(getState().getIn(keyPath));
  useEffect(() => {
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: () => {
        // console.log('#useFunc filter', keyPath, getState().getIn(keyPath));
        return getState().getIn(keyPath);
      },
      mark: 'useFunc',
    }).subscribe(([_, next]) => {
      // console.log('#useFunc next', next);
      setValue(next);
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, [keyPath, subSource, getState]);

  return value;
}
