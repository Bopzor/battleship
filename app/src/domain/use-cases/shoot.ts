import { Cell, ShotResult } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';

export const triggerShot = () => {
  return createAction('trigger shot');
};

export const setShotResult = (position: Cell, result: ShotResult) => {
  return createAction('set shot result', { position, result });
};

export const setShotError = (error: unknown) => {
  return createAction('set shot error', error);
};

export type Actions = ReturnType<typeof triggerShot | typeof setShotResult | typeof setShotError>;

export const shoot: UseCase =
  (position: Cell) =>
  async (dispatch, _, { battleshipGateway }) => {
    dispatch(triggerShot());

    try {
      const result = await battleshipGateway.shoot(position);

      dispatch(setShotResult(position, result));
    } catch (error) {
      dispatch(setShotError(error));
    }
  };
