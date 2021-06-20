import { Cell, ShotResult } from '../../redux/AppState';

export type ShotEvent = {
  type: 'SHOT';
  nick: string;
  cell: Cell;
  shotResult: ShotResult;
};

export type BattleshipEvent = ShotEvent;

export type MessageHandler = (event: BattleshipEvent) => void;

export interface BattleshipGateway {
  connectToServer(): Promise<void>;
  registerMessageHandler(handler: MessageHandler): void;
  shoot(position: Cell): Promise<ShotResult>;
}
