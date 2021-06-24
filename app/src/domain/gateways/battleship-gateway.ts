import { Cell, ShotResult } from '../../redux/AppState';

export type NickSetEvent = {
  type: 'NICK_SET';
  nick: string;
};

export type ShotEvent = {
  type: 'SHOT';
  nick: string;
  cell: Cell;
  shotResult: ShotResult;
};

export type BattleshipEvent = NickSetEvent | ShotEvent;

export type MessageHandler = (event: BattleshipEvent) => void;

export interface BattleshipGateway {
  connectToServer(): Promise<void>;
  registerMessageHandler(handler: MessageHandler): void;
  setNick(nick: string): Promise<void>;
  shoot(position: Cell): Promise<ShotResult>;
}
