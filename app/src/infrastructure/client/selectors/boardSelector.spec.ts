import expect from 'expect';

import { gameFetched } from '../../../domain/use-cases/get-game';
import {
  firstCellSelected,
  firstCellValidated,
  Ship,
  shipPlaced,
  shipPreselected,
} from '../../../domain/use-cases/select-cell';
import { configureStore } from '../../../redux';
import { BattleshipStore } from '../../../redux/types';
import { InMemoryBattleshipGateway } from '../../gateways/in-mem-battleship-gateway';

import { BoardCell, boardSelector } from './boardSelector';

describe('boardSelector', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: BattleshipStore;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
  });

  const cell = (partial?: Partial<BoardCell>): BoardCell => ({
    selected: false,
    validated: false,
    preselectedShip: false,
    canBePlaced: false,
    ship: false,
    ...partial,
  });

  it('generates an empty board', () => {
    store.dispatch(gameFetched({ boardSize: 2, requiredShipsSizes: [] }));

    expect(boardSelector(store.getState())).toEqual([
      [cell(), cell()],
      [cell(), cell()],
    ]);
  });

  it('generates a board containing two ships', () => {
    store.dispatch(gameFetched({ boardSize: 3, requiredShipsSizes: [2, 3] }));
    store.dispatch(shipPlaced(new Ship({ x: 0, y: 0 }, 'horizontal', 3)));
    store.dispatch(shipPlaced(new Ship({ x: 1, y: 1 }, 'vertical', 2)));

    // prettier-ignore
    expect(boardSelector(store.getState())).toEqual([
      [cell({ ship: true }), cell({ ship: true }), cell({ ship: true })],
      [cell(),               cell({ ship: true }), cell()              ],
      [cell(),               cell({ ship: true }), cell()              ],
    ]);
  });

  it('generates a board containing a selected cell', () => {
    store.dispatch(gameFetched({ boardSize: 1, requiredShipsSizes: [] }));
    store.dispatch(firstCellSelected({ x: 0, y: 0 }));

    // prettier-ignore
    expect(boardSelector(store.getState())).toEqual([
      [cell({ selected: true })],
    ]);
  });

  it('generates a board containing a validated cell', () => {
    store.dispatch(gameFetched({ boardSize: 1, requiredShipsSizes: [1] }));
    store.dispatch(firstCellSelected({ x: 0, y: 0 }));
    store.dispatch(firstCellValidated());

    // prettier-ignore
    expect(boardSelector(store.getState())).toEqual([
      [cell({ selected: true, validated: true })],
    ]);
  });

  it('generates a board containing a preselected ship that can be placed', () => {
    store.dispatch(gameFetched({ boardSize: 1, requiredShipsSizes: [1] }));
    store.dispatch(shipPreselected(new Ship({ x: 0, y: 0 }, 'horizontal', 1), true));

    // prettier-ignore
    expect(boardSelector(store.getState())).toEqual([
      [cell({ preselectedShip: true, canBePlaced: true })],
    ]);
  });

  it('generates a board containing a preselected ship that cannot be placed', () => {
    store.dispatch(gameFetched({ boardSize: 1, requiredShipsSizes: [1] }));
    store.dispatch(shipPreselected(new Ship({ x: 0, y: 0 }, 'horizontal', 1), false));

    // prettier-ignore
    expect(boardSelector(store.getState())).toEqual([
      [cell({ preselectedShip: true, canBePlaced: false })],
    ]);
  });
});
