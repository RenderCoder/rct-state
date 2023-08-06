import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { createDeepProxy } from 'rct-state';

const data = {
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

const proxyData = createDeepProxy(data);

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    const printData = {
      'proxyData.level1_1.level2_2': proxyData.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.get()': proxyData.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.peek()': proxyData.level1_1.level2_2.peek(),
      'proxyData.level1_1.level2_2.test.get()':
        proxyData.level1_1.level2_2.test.get(),
      'proxyData.level1_1.level2_2.test.peek()':
        proxyData.level1_1.level2_2.test.peek(),
      'proxyData.a.c.d': proxyData.a.c.d.get(),
      'proxyData.a.c.d.get()': proxyData.a.c.d.get(),
      'proxyData.a.c.d.peek()': proxyData.a.c.d.peek(),
      'proxyData.a.c.__keyPath': proxyData.a.c.__keyPath,
      'proxyData.a.c.d.__keyPath': proxyData.a.c.d.__keyPath,
    };
    console.log(
      '\n### proxyData.level1_1.level2_2.get();',
      JSON.stringify(printData, null, 2),
      printData
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
