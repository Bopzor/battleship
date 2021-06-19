import { Board } from './Board';

export interface PlayerRepository {
  countPlayers(): number;
  addPlayer(nick: string, board: Board): Player;
  findPlayerByNick(nick: string): Player | undefined;
  findAll(): Player[];
}

export const PlayerRepositorySymbol = Symbol.for('PlayerRepository');

export type Player = {
  nick: string;
  board: Board;
};
