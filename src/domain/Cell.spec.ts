import expect from 'expect';

import { Cell } from './Cell';

describe('Cell', () => {
  it('creates a cell when the data is valid', () => {
    const expectError = (rawData?: any) => {
      expect(() => Cell.create(rawData)).toThrow();
    };

    expectError();
    expectError(null);
    expectError([]);
    expectError('here');
    expectError({ x: 'x', y: 0 });
    expectError({ x: 0, y: 'y' });

    expect(new Cell(0, 1)).toMatchObject({ x: 0, y: 1 });
  });
});
