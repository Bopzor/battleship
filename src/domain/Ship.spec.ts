import expect from 'expect';

import { Direction } from './Direction';
import { Ship } from './Ship';

describe('Ship', () => {
  it('creates a ship when the data is valid', () => {
    const expectError = (rawData?: any) => {
      expect(() => Ship.create(rawData)).toThrow();
    };

    const defaults = {
      position: { x: 0, y: 1 },
      direction: 'vertical',
      size: 1,
    };

    expectError();
    expectError(null);
    expectError([]);
    expectError('here');
    expectError({ ...defaults, size: 2.5 });

    expect(Ship.create(defaults)).toMatchObject({
      position: { x: 0, y: 1 },
      direction: expect.any(Direction),
      size: 1,
    });
  });
});
