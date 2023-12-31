import { useRef, useState as ReactUseState } from 'react';
import { isEqual } from 'lodash';

/**
 * A variant method of useState to avoid repeated calculation of
 * components when setting the same value
 * @param initialState
 * @returns
 */
export function useState<S>(
  initialState: S
): [S, (value: S | ((prevState: S) => S)) => void] {
  const stateValue = useRef(initialState);
  const [state, _setState] = ReactUseState(initialState);

  const setState = (value: S | ((prevState: S) => S)): void => {
    const valueIsFunction = typeof value === 'function';
    // @ts-ignore
    const targetValue = valueIsFunction ? value(stateValue.current) : value;
    if (!isEqual(targetValue, stateValue.current)) {
      stateValue.current = targetValue;
      _setState(targetValue);
    }
  };

  return [state, setState];
}
