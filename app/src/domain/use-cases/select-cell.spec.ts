import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { Cell } from '../../redux/AppState';
import { BattleshipStore } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { selectCell, Ship, validateCellSelection } from './select-cell';

describe('select cell', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: BattleshipStore;
  let expectBoardState: ExpectStateSlice<'board'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectBoardState = expectStateSlice(store, 'board');
  });

  const validateCell = (cell: Cell) => {
    store.dispatch(selectCell(cell));
    store.dispatch(validateCellSelection(cell));
  };

  const expectOneShip = (...args: ConstructorParameters<typeof Ship>) => {
    expectBoardState({
      firstCell: undefined,
      ships: [new Ship(...args)],
    });
  };

  const expectShipPlacement =
    (c1: Cell, c2: Cell) =>
    (...args: Parameters<typeof expectOneShip>) => {
      store = configureStore({ battleshipGateway });
      expectBoardState = expectStateSlice(store, 'board');

      validateCell(c1);
      validateCell(c2);

      expectOneShip(...args);
    };

  it('selects two cells to place a ship', () => {
    validateCell({ x: 1, y: 2 });
    store.dispatch(selectCell({ x: 1, y: 4 }));

    expectBoardState({
      preselectedShip: new Ship({ x: 1, y: 2 }, 'vertical', 3),
      firstCell: { x: 1, y: 2 },
    });
  });

  it('places a ship vertically', () => {
    validateCell({ x: 1, y: 2 });

    expectBoardState({
      firstCell: { x: 1, y: 2 },
    });

    validateCell({ x: 1, y: 4 });

    expectOneShip({ x: 1, y: 2 }, 'vertical', 3);
  });

  it('places a ship horizontally', () => {
    validateCell({ x: 1, y: 2 });
    validateCell({ x: 4, y: 2 });

    expectOneShip({ x: 1, y: 2 }, 'horizontal', 4);
  });

  it('places a ship selecting cells from right to left', () => {
    validateCell({ x: 4, y: 2 });
    validateCell({ x: 1, y: 2 });

    expectOneShip({ x: 1, y: 2 }, 'horizontal', 4);
  });

  it('places a ship selecting cells from bottom to top', () => {
    validateCell({ x: 1, y: 4 });
    validateCell({ x: 1, y: 2 });

    expectOneShip({ x: 1, y: 2 }, 'vertical', 3);
  });

  it('places a ship selecting cells that are not aligned', () => {
    expectShipPlacement({ x: 3, y: 1 }, { x: 2, y: 4 })({ x: 3, y: 1 }, 'vertical', 4);
    expectShipPlacement({ x: 4, y: 3 }, { x: 1, y: 1 })({ x: 1, y: 3 }, 'horizontal', 4);
    expectShipPlacement({ x: 6, y: 2 }, { x: 4, y: 4 })({ x: 4, y: 2 }, 'horizontal', 3);
    expectShipPlacement({ x: 6, y: 2 }, { x: 2, y: 8 })({ x: 6, y: 2 }, 'vertical', 7);
    expectShipPlacement({ x: 1, y: 4 }, { x: 6, y: 5 })({ x: 1, y: 4 }, 'horizontal', 6);
    expectShipPlacement({ x: 1, y: 4 }, { x: 6, y: 3 })({ x: 1, y: 4 }, 'horizontal', 6);
  });
});
