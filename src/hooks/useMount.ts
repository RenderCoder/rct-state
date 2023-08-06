import { useEffect, useRef } from 'react';
import type { EffectCallback } from 'react';

export function useMount(callback: EffectCallback) {
  const mounted = useRef(false);
  useEffect(() => {
    let clearAction: () => void | void;
    if (!mounted.current) {
      mounted.current = true;
      const result = callback();
      if (result) {
        clearAction = result;
      }
    }

    return () => {
      if (clearAction) {
        clearAction();
      }
    };
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps
}
