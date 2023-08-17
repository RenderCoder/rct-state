import { Map, List } from 'immutable';

type ListType<T> = T extends Immutable.List<infer E> ? E[] : never;

function createProxiedList<T>(list: List<T>): ListType<T> {
  return new Proxy(list, {
    get(target: List<T>, key: PropertyKey) {
      const numKey = Number(key);

      if (Number.isNaN(numKey)) {
        return Reflect.get(target, key);
      }

      const value = target.get(numKey);
      if (Map.isMap(value)) {
        return createProxiedMap(value);
      } else if (List.isList(value)) {
        return createProxiedList(value as List<any>);
      }
      return value;
    },
    set(target: List<T>, key: PropertyKey, value: any) {
      const numKey = Number(key);
      if (Number.isNaN(numKey)) {
        return false;
      }
      target.set(numKey, value);
      return true;
    },
  }) as any as ListType<T>;
}

// type MapType<T> = T extends Map<infer K, infer V> ? { key: K, value: V } : never;
type MapType<T> = T extends Map<infer K, infer V>
  ? Record<(K & string) | number | symbol, V>
  : // @ts-ignore
    Record<(K & string) | number | symbol, V>;

function createProxiedMap<T extends Map<K, V>, K, V>(map: T): MapType<T> {
  return new Proxy(map, {
    get(target: T, key: string | symbol): V | undefined {
      const mapValue: V | undefined = target.get(key as K);
      if (mapValue === undefined) {
        return mapValue;
      }

      if (Map.isMap(mapValue)) {
        return createProxiedMap(
          mapValue as Map<K, V>
        ) as MapType<T>[keyof MapType<T>];
      } else if (List.isList(mapValue)) {
        return createProxiedList(
          mapValue as List<any>
        ) as MapType<T>[keyof MapType<T>];
      }
      return mapValue as MapType<T>[keyof MapType<T>];
    },
    set(target: T, key: string | symbol, value: any) {
      target.set(key as K, value);
      return true;
    },
  }) as MapType<T>;
}

export function wrapGetter<T extends object>(data: T) {
  return createProxiedMap(Map(data)) as T;
}

export function wrapGetterForMap<T extends object>(data: Map<any, any>) {
  return createProxiedMap(data) as T;
}

export function wrapAsImmutable<T extends object>(data: T) {
  const mapData = Map(data);
  return {
    getter: createProxiedMap(mapData) as T,
    mapData,
  };
}
