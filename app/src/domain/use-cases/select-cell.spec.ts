import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { Cell } from '../../redux/AppState';
import { BattleshipStore } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { gameFetched } from './get-game';
import {
  firstCellSelected,
  firstCellValidated,
  selectCell,
  Ship,
  shipPreselected,
  validateCellSelection,
} from './select-cell';

describe('select cell', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: BattleshipStore;
  let expectBoardState: ExpectStateSlice<'board'>;

  const resetStore = () => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectBoardState = expectStateSlice(store, 'board');
  };

  beforeEach(resetStore);

  const setRequriedShipSizes = (requiredShipSizes: number[]) => {
    store.dispatch(gameFetched({ requiredShipSizes }));
    expectBoardState.saveInitialState();
  };

  const setFirstCell = (cell: Cell) => {
    store.dispatch(firstCellSelected(cell));
    store.dispatch(firstCellValidated());
  };

  const expectShipPlacement = (c1: Cell, c2: Cell) => (ship: Ship) => {
    resetStore();
    setRequriedShipSizes([ship.size]);
    setFirstCell(c1);

    store.dispatch(selectCell(c2));

    expectBoardState({
      firstCell: c1,
      firstCellValidated: true,
      preselectedShip: ship,
      preselectedShipCanBePlaced: true,
    });
  };

  it('selects a cell', () => {
    setRequriedShipSizes([1]);

    store.dispatch(selectCell({ x: 1, y: 2 }));

    expectBoardState({
      firstCell: { x: 1, y: 2 },
      firstCellValidated: false,
    });
  });

  it('selects a second cell to place a ship vertically', () => {
    setRequriedShipSizes([3]);
    setFirstCell({ x: 1, y: 2 });

    store.dispatch(selectCell({ x: 1, y: 4 }));

    expectBoardState({
      firstCell: { x: 1, y: 2 },
      firstCellValidated: true,
      preselectedShip: new Ship({ x: 1, y: 2 }, 'vertical', 3),
      preselectedShipCanBePlaced: true,
    });
  });

  it('selects a second cell to place a ship vertically, from bottom to top', () => {
    setRequriedShipSizes([3]);
    setFirstCell({ x: 1, y: 4 });

    store.dispatch(selectCell({ x: 1, y: 2 }));

    expectBoardState({
      firstCell: { x: 1, y: 4 },
      firstCellValidated: true,
      preselectedShip: new Ship({ x: 1, y: 2 }, 'vertical', 3),
      preselectedShipCanBePlaced: true,
    });
  });

  it('selects a second cell to place a ship horizontally', () => {
    setRequriedShipSizes([4]);
    setFirstCell({ x: 1, y: 2 });

    store.dispatch(selectCell({ x: 4, y: 2 }));

    expectBoardState({
      firstCell: { x: 1, y: 2 },
      firstCellValidated: true,
      preselectedShip: new Ship({ x: 1, y: 2 }, 'horizontal', 4),
      preselectedShipCanBePlaced: true,
    });
  });

  it('selects a second cell to place a ship horizontally, from right to left', () => {
    setRequriedShipSizes([4]);
    setFirstCell({ x: 4, y: 2 });

    store.dispatch(selectCell({ x: 1, y: 2 }));

    expectBoardState({
      firstCell: { x: 4, y: 2 },
      firstCellValidated: true,
      preselectedShip: new Ship({ x: 1, y: 2 }, 'horizontal', 4),
      preselectedShipCanBePlaced: true,
    });
  });

  it('validates a selected cell', () => {
    store.dispatch(firstCellSelected({ x: 1, y: 2 }));

    store.dispatch(validateCellSelection());

    expectBoardState({
      firstCell: { x: 1, y: 2 },
      firstCellValidated: true,
    });
  });

  it('validates a preselected ship', () => {
    setRequriedShipSizes([3]);

    store.dispatch(firstCellSelected({ x: 1, y: 2 }));
    store.dispatch(firstCellValidated());
    store.dispatch(shipPreselected(new Ship({ x: 1, y: 2 }, 'vertical', 3), true));

    store.dispatch(validateCellSelection());

    expectBoardState({
      ships: [new Ship({ x: 1, y: 2 }, 'vertical', 3)],
    });
  });

  it('places a ship selecting cells that are not aligned', () => {
    expectShipPlacement({ x: 3, y: 1 }, { x: 2, y: 4 })(new Ship({ x: 3, y: 1 }, 'vertical', 4));
    expectShipPlacement({ x: 4, y: 3 }, { x: 1, y: 1 })(new Ship({ x: 1, y: 3 }, 'horizontal', 4));
    expectShipPlacement({ x: 6, y: 2 }, { x: 4, y: 4 })(new Ship({ x: 4, y: 2 }, 'horizontal', 3));
    expectShipPlacement({ x: 6, y: 2 }, { x: 2, y: 8 })(new Ship({ x: 6, y: 2 }, 'vertical', 7));
    expectShipPlacement({ x: 1, y: 4 }, { x: 6, y: 5 })(new Ship({ x: 1, y: 4 }, 'horizontal', 6));
    expectShipPlacement({ x: 1, y: 4 }, { x: 6, y: 3 })(new Ship({ x: 1, y: 4 }, 'horizontal', 6));
  });

  it('does not select a cell when there is no more ship remaining', () => {
    store.dispatch(selectCell({ x: 1, y: 2 }));
    expectBoardState({ firstCell: undefined });

    setRequriedShipSizes([]);
    store.dispatch(selectCell({ x: 1, y: 2 }));
    expectBoardState({ firstCell: undefined });
  });

  it('does not allow to place a ship of an unavailable size', () => {
    setRequriedShipSizes([3]);

    setFirstCell({ x: 1, y: 2 });
    store.dispatch(selectCell({ x: 1, y: 3 }));

    expectBoardState({
      firstCell: { x: 1, y: 2 },
      firstCellValidated: true,
      preselectedShip: new Ship({ x: 1, y: 2 }, 'vertical', 2),
      preselectedShipCanBePlaced: false,
    });
  });
});
