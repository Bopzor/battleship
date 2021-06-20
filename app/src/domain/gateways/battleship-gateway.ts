import { Cell, ShotResult } from '../../redux/AppState';

export interface BattleshipGateway {
  shoot(position: Cell): Promise<ShotResult>;
}
