declare global {
  var window: any;
  var navigator: any;
}

const isBrowser = typeof window !== 'undefined';
const isReactNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

export const isSSR = !(isBrowser || isReactNative);
