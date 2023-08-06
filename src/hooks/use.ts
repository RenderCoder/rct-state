import { get as _get } from 'lodash';
import { useMount } from './useMount';
import { useState } from './useState';
import type { BehaviorSubject } from 'rxjs';
import { generateSubForSpecificChange } from '../utils/subscribe';

interface UseConfig {
  keyPath: string[];
  subSource: BehaviorSubject<any>;
}

export function useFunc({ keyPath, subSource }: UseConfig) {
  const [value, setValue] = useState(_get(subSource.value, keyPath));
  useMount(() => {
    console.log('use() create sub');
    const sub = generateSubForSpecificChange({
      subject: subSource,
      filter: (data: any) => {
        return _get(data, keyPath);
      },
    }).subscribe(([_, next]) => {
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
