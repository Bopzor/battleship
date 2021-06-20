import { Shot } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';

const shotReceived = (shot: Shot) => createAction('shot received', shot);

export type Actions = ReturnType<typeof shotReceived>;

export const receiveShot: UseCase = (shot: Shot) => (dispatch) => {
  dispatch(shotReceived(shot));
};
