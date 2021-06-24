import { createAction, UseCase } from '../../redux/types';

const nickSet = (nick: string) => createAction('nick set', nick);

export type Actions = ReturnType<typeof nickSet>;

export const setNick: UseCase =
  (nick: string) =>
  async (dispatch, _, { battleshipGateway }) => {
    await battleshipGateway.setNick(nick);
    dispatch(nickSet(nick));
  };
