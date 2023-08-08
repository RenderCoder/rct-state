import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { observable } from 'rct-state';
import { useMount } from '../../src/hooks/useMount';

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

const store$ = observable(data);

export default function App() {
  const count = store$.view.count.use();
  const count$ = store$.useSelector(() => {
    const res = store$.view.count.peek();
    return res;
  });
  const info = state$.demo.a.b[0]?.info.use();

  useMount(() => {
    let count = 0;
    const id = setInterval(() => {
      count += 1;
      state$.demo.a.b[0]?.info.set('hello ' + Math.random());
      if (count > 5) {
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  });

  console.log('###info', info);

  store$.useObserve(
    () => {
      return { count: store$.view.count.peek() };
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

  React.useEffect(() => {
    const printData = {
      'proxyData.level1_1.level2_2': store$.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.get()': store$.level1_1.level2_2.get(),
      'proxyData.level1_1.level2_2.peek()': store$.level1_1.level2_2.peek(),
      'proxyData.level1_1.level2_2.test.get()':
        store$.level1_1.level2_2.test.get(),
      'proxyData.level1_1.level2_2.test.peek()':
        store$.level1_1.level2_2.test.peek(),
      'proxyData.a.c.d': store$.a.c.d.get(),
      'proxyData.a.c.d.get()': store$.a.c.d.get(),
      'proxyData.a.c.d.peek()': store$.a.c.d.peek(),
      'proxyData.a.c.__keyPath': store$.a.c.__keyPath,
      'proxyData.a.c.d.__keyPath': store$.a.c.d.__keyPath,
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
        onPress={() => {
          store$.batch(() => {
            store$.view.count.set(store$.view.count.peek() + 1);
            store$.view.count.set(store$.view.count.peek() + 1);
            store$.view.count.set(store$.view.count.peek() + 1);
          });
        }}
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

/**
 * for multi-level nested data
 */

interface State {
  playing: boolean;
  /**
   * duration in millseconds
   */
  duration: number;
  /**
   * curentTime in millseconds
   */
  currentTime: number;
  /**
   * current section index
   */
  sectionIndex: number;
  sections: Array<{
    filePath: string;
    type: 'video' | 'image';
    previewImage: string;
  }>;
  demo: { a: { b: Array<{ info: string }> } };
  percentage: () => number;
}

const initialState: State = {
  playing: false,
  duration: 10,
  currentTime: 0,
  sectionIndex: 0,
  sections: [],
  demo: { a: { b: [{ info: 'hello' }] } },
  percentage() {
    return this.currentTime / this.duration;
  },
};

const state$ = observable(initialState);
// @ts-ignore
global.state$ = state$;

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
