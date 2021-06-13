import expect from 'expect';

import { areArraysEquivalent } from './utils';

describe('areArraysEquivalent', () => {
  it('checks that both arrays contains the same values', () => {
    expect(areArraysEquivalent([1, 2], [1, 2])).toBe(true);
    expect(areArraysEquivalent([1, 2], [2, 3])).toBe(false);
    expect(areArraysEquivalent([1, 1], [1, 2])).toBe(false);
    expect(areArraysEquivalent([1, 2], [1, 1])).toBe(false);
    expect(areArraysEquivalent([1], [1, 1])).toBe(false);
    expect(areArraysEquivalent([1, 1], [1])).toBe(false);
    expect(areArraysEquivalent([1, 2, 3, 4], [4, 5, 6, 7])).toBe(false);
    expect(areArraysEquivalent([1, 2, 3, 4], [4, 3, 2, 1])).toBe(true);
    expect(areArraysEquivalent([1, 2, 2, 4], [2, 4, 2, 1])).toBe(true);
  });
});
