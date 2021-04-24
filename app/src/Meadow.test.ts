import { Meadow } from './Meadow';
import { SheepHerd } from './SheepHerd';

describe('Meadow', () => {
  it('is empty', () => {
    const meadow = new Meadow();

    expect(meadow.sheeps).toHaveLength(0);
  });

  it('has one herd', () => {
    const meadow = new Meadow();
    const herd = new SheepHerd(1, { x:0, y: 0 }, 'horizontal');

    meadow.addHerd(herd);

    expect(meadow.sheeps).toHaveLength(1);
  });

  it('has a sheep at x: 5, y: 3', () => {
    const meadow = new Meadow();
    const herd1 = new SheepHerd(1, { x: 0, y: 0 }, 'horizontal');
    const herd2 = new SheepHerd(2, { x: 5, y: 3 }, 'vertical');

    meadow.addHerd(herd1);
    meadow.addHerd(herd2);

    expect(meadow.getHerdAt({ x: 5, y: 3 })).toBe(herd2);
    expect(meadow.getHerdAt({ x: 5, y: 4 })).toBe(herd2);
  });

  it('has no sheep at x: 1, y: 0', () => {
    const meadow = new Meadow();
    const herd = new SheepHerd(1, { x: 0, y: 0 }, 'horizontal');

    meadow.addHerd(herd);

    expect(meadow.getHerdAt({ x: 5, y: 3 })).toBe(undefined);
  });
});
