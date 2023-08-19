const IMMUTABLE_ITERABLE = '@@__IMMUTABLE_ITERABLE__@@';
const IMMUTABLE_RECORD = '@@__IMMUTABLE_RECORD__@@';
const IMMUTABLE_LIST = '@@__IMMUTABLE_LIST__@@';
const IMMUTABLE_MAP = '@@__IMMUTABLE_MAP__@@';

/**
 * check if object is immutbale type or Proxy wrapped immutable type
 * @param obj
 * @returns
 */
export function isImmutableObject(obj: any): boolean {
  if (typeof obj !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  if (
    proto[IMMUTABLE_ITERABLE] ||
    proto[IMMUTABLE_RECORD] ||
    proto[IMMUTABLE_LIST] ||
    proto[IMMUTABLE_MAP]
  ) {
    return true;
  }

  return false;
}
