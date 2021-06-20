import { BattleshipGateway } from '../../domain/gateways/battleship-gateway';
import { Cell, ShotResult } from '../../redux/AppState';
import { AsyncResult } from '../../shared/AsyncResult';

export class InMemoryBattleshipGateway implements BattleshipGateway {
  private _shootResult = new AsyncResult<ShotResult>();

  resolveShoot = this._shootResult.resolve;
  rejectShoot = this._shootResult.reject;

  shoot(_position: Cell): Promise<ShotResult> {
    return this._shootResult.register();
  }
}
