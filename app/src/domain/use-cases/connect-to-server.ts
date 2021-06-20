import { createAction, UseCase } from '../../redux/types';

const serverConnectionError = (error: unknown) => createAction('server connection error', error);
const connectedToServer = () => createAction('connected to server');

export type Actions = ReturnType<typeof serverConnectionError | typeof connectedToServer>;

export const connectToServer: UseCase =
  () =>
  async (dispatch, _, { battleshipGateway }) => {
    try {
      await battleshipGateway.connectToServer();
      dispatch(connectedToServer());
    } catch (error) {
      dispatch(serverConnectionError(error));
    }
  };
