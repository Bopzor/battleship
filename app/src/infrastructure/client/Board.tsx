import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCell, validateCellSelection } from '../../domain/use-cases/select-cell';

import { BoardCell, boardSelector } from './selectors/boardSelector';

const cellColor = (cell: BoardCell): React.CSSProperties['background'] => {
  if (cell.ship) {
    return '#333';
  }

  if (cell.selected) {
    return '#3FF';
  }

  if (cell.preselectedShip) {
    if (!cell.canBePlaced) {
      return '#6666';
    }

    return '#666';
  }

  return '#CCF';
};

const Cell: React.FC<{ x: number; y: number; cell: BoardCell }> = ({ x, y, cell }) => {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        width: 30,
        height: 30,
        background: cellColor(cell),
        cursor: cell.canBePlaced ? 'pointer' : undefined,
      }}
      onMouseOver={() => dispatch(selectCell({ x, y }))}
      onClick={() => dispatch(validateCellSelection())}
    />
  );
};

const Board: React.FC = () => {
  const board = useSelector(boardSelector);

  return (
    <div>
      {board.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <Cell key={x} x={x} y={y} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
