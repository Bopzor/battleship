import { Shot } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';
import { BattleshipEvent } from '../gateways/battleship-gateway';

const shotReceived = (shot: Shot) => createAction('shot received', shot);

export type Actions = ReturnType<typeof shotReceived>;

export const receiveEvent: UseCase = (event: BattleshipEvent) => (dispatch) => {
  dispatch(
    shotReceived({
      position: event.cell,
      result: event.shotResult,
    }),
  );
};
