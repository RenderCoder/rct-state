import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createDeepProxy, observable } from 'rct-state';

const data = {
  view: {
    count: 0,
  },
  level1: {
    level2: {
      value: 'original',
    },
  },
  level1_1: {
    level2_2: {
      test: 'hello',
    },
  },
  testValue: '1230',
  a: {
    b: '@b',
    c: {
      d: '@d',
    },
  },
};

const store = observable(data);

export default function App() {
  const count = store.view.count.use();
  const count$ = store.useSelector(() => {
    const res = store.view.count.peek();
    return res;
  });
  console.log('### count', count, count$);

  React.useEffect(() => {
    const printData = {
      'proxyData.level1_1.level2_2': store.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.get()': store.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.peek()': store.level1_1.level2_2.peek(),
      'proxyData.level1_1.level2_2.test.get()':
        store.level1_1.level2_2.test.get(),
      'proxyData.level1_1.level2_2.test.peek()':
        store.level1_1.level2_2.test.peek(),
      'proxyData.a.c.d': store.a.c.d.get(),
      'proxyData.a.c.d.get()': store.a.c.d.get(),
      'proxyData.a.c.d.peek()': store.a.c.d.peek(),
      'proxyData.a.c.__keyPath': store.a.c.__keyPath,
      'proxyData.a.c.d.__keyPath': store.a.c.d.__keyPath,
    };
    console.log(
      '\n### proxyData.level1_1.level2_2.get();',
      JSON.stringify(printData, null, 2),
      printData
    );
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          store.view.count.set(store.view.count.peek() + 1)
        }
      >
        <Text>Result: {count$}</Text>
      </TouchableOpacity>
    </View>
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
