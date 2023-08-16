import { useMount } from './useMount';
import { useState } from './useState';
import type { BehaviorSubject } from 'rxjs';
import { generateSubForSpecificChange } from '../utils/subscribe';

interface UseSelectorConfig<T> {
  selectorFunction: (state: T) => any;
  subSource: BehaviorSubject<any>;
}

export function useSelector<T>({
  selectorFunction,
  subSource,
}: UseSelectorConfig<T>) {
  const [value, setValue] = useState(selectorFunction(subSource.value));
  useMount(() => {
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: selectorFunction,
    }).subscribe(([_, next]) => {
      console.log('rct-state useSelector', next);
      setValue(next);
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  });

  return value;
}
