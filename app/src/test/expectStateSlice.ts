import expect from 'expect';

import { AppState } from '../redux/AppState';
import { BattleshipStore } from '../redux/types';

export interface ExpectStateSlice<Slice extends keyof AppState> {
  (partial: Partial<AppState[Slice]>): void;
  saveInitialState: () => void;
}

export const expectStateSlice = <Slice extends keyof AppState>(
  store: BattleshipStore,
  slice: Slice,
) => {
  let initialState = store.getState();

  const expectSlice: ExpectStateSlice<Slice> = (partial) => {
    expect(store.getState()).toEqual({
      ...initialState,
      [slice]: {
        ...initialState[slice],
        ...partial,
      },
    });
  };

  expectSlice.saveInitialState = () => {
    initialState = store.getState();
  };

  return expectSlice;
};
