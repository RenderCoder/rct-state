import * as React from 'react';

import { ChakraProvider, Stack } from '@chakra-ui/react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StateValue } from './components/stateValue';
import { UserProfile } from './components/userProfile';
import { state$, type State } from './state';

export default function App() {
  const count = state$.count.use();
  const count$ = state$.useSelector(() => {
    const res = state$.count.peek();
    return res;
  });
  const info = state$.demo.a.b[0]?.info.use();

  console.log('###info', info);

  state$.useObserve(
    () => {
      return { count: state$.count.peek() };
    },
    (countValue) => {
      console.log('### useObserve count on change', countValue);
    }
  );

  state$.useObserve(
    () => {
      return state$.demo.a.b[0]?.info.peek();
    },
    (value) => {
      console.log('#info change', value);
    }
  );

  console.log('### count', count, count$);

  return (
    <ChakraProvider>
      <Stack direction="column" width="100%">
        <StateValue />
        <UserProfile />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              state$.batch(() => {
                state$.count.set(state$.count.peek() + 1);
              });
            }}
          >
            <Text>Result: {count$}</Text>
          </TouchableOpacity>
        </View>
      </Stack>
    </ChakraProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

const section = {
  setData: (sections: State['sections']) => {
    state$.sections.set(sections);
    const sec = state$.sections.get();
    sec[0]?.filePath;

    // const info = state$.demo.a.b[0]?.info.get();
  },
};

// const percentage = state$.percentage.get();

console.log('#section', section);

const unsub = state$.observe(
  (state) => {
    console.log('### state', state);
    return state.demo.a.b[0]?.info;
  },
  (value) => {
    console.log('state$.observe info', value);
  }
);

setTimeout(unsub, 2000);
