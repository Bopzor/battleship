import expect from 'expect';

import { Direction } from './Direction';

describe('Direction', () => {
  it('creates a direction when the data is valid', () => {
    const expectError = (rawData?: any) => {
      expect(() => Direction.create(rawData)).toThrow();
    };

    expectError();
    expectError(null);
    expectError({});
    expectError('direction');

    expect(Direction.create('horizontal').toString()).toEqual('horizontal');
    expect(Direction.create('vertical').toString()).toEqual('vertical');
  });
});
