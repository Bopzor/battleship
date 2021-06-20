import { createAction, UseCase } from '../../redux/types';

import { receiveShot } from './receive-shot';

const serverConnectionError = (error: unknown) => createAction('server connection error', error);
const connectedToServer = () => createAction('connected to server');

export type Actions = ReturnType<typeof serverConnectionError | typeof connectedToServer>;

export const connectToServer: UseCase =
  () =>
  async (dispatch, _, { battleshipGateway }) => {
    try {
      await battleshipGateway.connectToServer();
      dispatch(connectedToServer());

      battleshipGateway.registerMessageHandler((event) => {
        if (event.type === 'SHOT') {
          dispatch(receiveShot(event));
        }
      });
    } catch (error) {
      dispatch(serverConnectionError(error));
    }
  };
