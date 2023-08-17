import { observable } from 'rct-state';
/**
 * for multi-level nested data
 */

export interface State {
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
  user: {
    name: string;
    age: number;
    bio: string;
    address: {
      city: string;
      street: string;
    };
    email: string;
  };
  count: number;
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
  user: {
    name: 'Jack',
    age: 18,
    bio: 'hello world',
    address: {
      city: 'New York',
      street: '5th Avenue',
    },
    email: 'hello@a.com',
  },
  count: 0,
};

export const state$ = observable(initialState);
// @ts-ignore
global.state$ = state$;
