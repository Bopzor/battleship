import { Cell, ShotResult } from '../../redux/AppState';

export interface BattleshipGateway {
  connectToServer(): Promise<void>;
  shoot(position: Cell): Promise<ShotResult>;
}
