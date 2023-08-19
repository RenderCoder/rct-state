# rct-state

Legend-State style state library with Rx for React

## Installation

```sh
npm install rct-state
```

## Usage

Basic usage for pure JavaScript:

```tsx
// file: userData.ts

import { observable } from 'rct-state';

// define type for state
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: 'jojo',
}

// create store
export const user$ = observable(user);

// get user id
const userId = user$.id.get();

// set user id
user$.id.set(99);

// watch user id change
user$.observe((state) => {
  return state.id
}, (id) => {
  console.log('user id changed:', id)
})

```

Basic usage for React Native or React component:

```tsx
import React from 'react';
import { View, Text } from 'react-native'
import { user$ } from './userData'


export function UserPanel() {
  const { id, name } = user$.use()

  return (
    <View>
      <Text>ID: { id }</Text>
      <Text>Name: { name }</Text>
    </View>
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
