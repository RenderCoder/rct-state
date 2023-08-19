import {
  Subject,
  filter,
  map,
  pairwise,
  defaultIfEmpty,
  startWith,
  Observable,
} from 'rxjs';
import _ from 'lodash';

export function generateSubForSpecificChange<T, K>(config: {
  subject: Subject<T>;
  filter: (data: T) => K;
  /**
   * sub source default value,
   * for scenarios where the config.subject type is not BehaviorSubject
   */
  defaultData?: T;
  /**
   * debug mark
   */
  mark?: string;
}) {
  const defaultValue: T = (config.subject as any).value
    ? (config.subject as any).value
    : config.defaultData
    ? config.filter(config.defaultData)
    : undefined;
  const defaultFilteredData =
    defaultValue !== undefined ? config.filter(defaultValue) : undefined;

  const sub = config.subject.pipe(
    startWith(undefined),
    map((data: T | undefined) => {
      if (data === undefined) {
        return undefined;
      }
      return config.filter(data);
    }),
    pairwise(),
    filter(([prev, next]) => {
      // console.log('## prev', prev, next, { mark: config.mark });
      return !_.isEqual(prev, next);
    }),
    defaultIfEmpty([defaultFilteredData, defaultFilteredData])
  ) as Observable<[K | undefined, K]>;
  return sub;
}

export default {
  generateSubForSpecificChange,
};
