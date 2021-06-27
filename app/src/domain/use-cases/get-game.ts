import { createAction } from '../../redux/types';

export const gameFetched = (data: { boardSize: number; requiredShipsSizes: number[] }) => {
  return createAction('game fetched', data);
};

export type Actions = ReturnType<typeof gameFetched>;
