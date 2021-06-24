import { Shot } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';
import { BattleshipEvent, NickSetEvent, ShotEvent } from '../gateways/battleship-gateway';

const shotReceived = (shot: Shot) => createAction('shot received', shot);
const opponentNickSet = (opponentNick: string) => createAction('opponent nick set', opponentNick);

export type Actions = ReturnType<typeof shotReceived | typeof opponentNickSet>;

const map: Record<BattleshipEvent['type'], (event: any) => Actions> = {
  NICK_SET: (event: NickSetEvent) => opponentNickSet(event.nick),
  SHOT: (event: ShotEvent) => {
    return shotReceived({
      position: event.cell,
      result: event.shotResult,
    });
  },
};

export const receiveEvent: UseCase = (event: BattleshipEvent) => (dispatch) => {
  dispatch(map[event.type](event));
};
