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

// ---------------

// 具体类型可根据实际数据结构定义
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Phones {
  home: string;
  work: string;
}

interface Preferences {
  newsletters: boolean;
  smsNotifications: boolean;
}

interface Profile {
  firstName: string;
  lastName: string;
  address: Address;
  phones: Phones;
  email: string;
}

interface User {
  id: number;
  profile: Profile;
  preferences: Preferences;
  messages: Array<{ time: number; content: string }>;
}

const userData: User = {
  id: 123,
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    address: {
      street: '123 Main St.',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
    },
    phones: {
      home: '123-555-6789',
      work: '321-555-6789',
    },
    email: 'john.doe@example.com',
  },
  preferences: {
    newsletters: true,
    smsNotifications: false,
  },
  messages: [],
};

function createUser() {
  const user = Map(userData);

  return user;
}

const user = createUser();
console.log(user.toJS());

type ToMap<T> = {
  [K in keyof T]: T[K] extends object ? Map<keyof T[K], ToMap<T[K]>> : T[K];
};

function observer<T extends object>(data: T) {
  return createProxiedMap(Map(data)) as T;
}

// const proxyUser = createProxiedMap(user) as unknown as MapType<typeof user>;
const proxyUser = observer(userData);
const messages = proxyUser.messages;
messages.push({ time: Date.now(), content: 'Hello' });
if (messages[0]) {
  messages[0].content = 'Hello World';
}

console.log('#id', proxyUser.id, proxyUser.messages[0]);

setInterval(() => {}, 1000);
