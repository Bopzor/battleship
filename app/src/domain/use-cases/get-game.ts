import { createAction } from '../../redux/types';

export const gameFetched = (data: { requiredShipSizes: number[] }) =>
  createAction('game fetched', data);

export type Actions = ReturnType<typeof gameFetched>;
