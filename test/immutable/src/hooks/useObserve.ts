import { useMount } from './useMount';
import type { BehaviorSubject } from 'rxjs';
import { generateSubForSpecificChange } from '../utils/subscribe';

interface UseObserveConfig<T, P = any> {
  selectorFunction: (state: T) => P;
  subSource: BehaviorSubject<any>;
  onChangeFunction: (value: P) => void;
}

export function useObserve<T, P>({
  selectorFunction,
  subSource,
  onChangeFunction,
}: UseObserveConfig<T, P>) {
  useMount(() => {
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: selectorFunction,
    }).subscribe(([_, next]) => {
      onChangeFunction(next);
    });

    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  });
}
