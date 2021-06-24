import expect from 'expect';

import { AppState } from '../redux/AppState';
import { BattleshipStore } from '../redux/types';

export type ExpectStateSlice<Slice extends keyof AppState> = (
  partial: Partial<AppState[Slice]>,
) => void;

export const expectStateSlice = <Slice extends keyof AppState>(
  store: BattleshipStore,
  slice: Slice,
): ExpectStateSlice<Slice> => {
  const initialState = store.getState();

  return (partial) => {
    expect(store.getState()).toEqual({
      ...initialState,
      [slice]: {
        ...initialState[slice],
        ...partial,
      },
    });
  };
};
