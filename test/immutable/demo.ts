import { Map } from 'immutable';
import { observable } from './src/index';
// import { wrapGetter } from './src/proxy/immutableGetter';
import { memoryUsage } from './memory';
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

// type ToMap<T> = {
//   [K in keyof T]: T[K] extends object ? Map<keyof T[K], ToMap<T[K]>> : T[K];
// };

// const proxyUser = createProxiedMap(user) as unknown as MapType<typeof user>;
/*
const proxyUser = wrapGetter(userData);
const messages = proxyUser.messages;
messages.push({ time: Date.now(), content: 'Hello' });
if (messages[0]) {
  messages[0].content = 'Hello World';
}

console.log('#id', proxyUser.id, proxyUser.messages[0]);
*/
setInterval(() => {}, 1000);

const state$ = observable(userData);

console.log('### get id', state$.id.get());

state$.observe(
  (state) => {
    return state.id;
  },
  (id) => {
    console.log('id changed', id);
  }
);

state$.observe(
  (state) => {
    return state.messages.length;
  },
  (count) => {
    console.log('message count changed', count);
  }
);

/*
setInterval(() => {
  state$.id.set(Math.round(Math.random() * 100));
  console.log('#memoryUsage', memoryUsage());
}, 50);
//*/

//*
setInterval(() => {
  // @ts-ignore
  state$.messages.set(state$.messages.get().push({ time: Date.now(), content: 'Hello' }));
  console.log('#memoryUsage', memoryUsage());
}, 100);
//*/
