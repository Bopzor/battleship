import { Shot } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';
import { ShotEvent } from '../gateways/battleship-gateway';

const shotReceived = (shot: Shot) => createAction('shot received', shot);

export type Actions = ReturnType<typeof shotReceived>;

export const receiveShot: UseCase = (event: ShotEvent) => (dispatch) => {
  dispatch(
    shotReceived({
      position: event.cell,
      result: event.shotResult,
    }),
  );
};
