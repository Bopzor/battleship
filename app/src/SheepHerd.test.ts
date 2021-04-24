import { SheepHerd } from './SheepHerd';

describe('SheepHerd', () => {
  it('has not been eaten', () => {
    const sheepHerd = new SheepHerd(2, { x: 0, y: 0 }, 'horizontal');

    expect(sheepHerd.attack({ x: 9, y: 9 })).toBe('missed');
    expect(sheepHerd.attack({ x: 2, y: 2 })).toBe('missed');
    expect(sheepHerd.attack({ x: 2, y: 0 })).toBe('missed');
  });

  it('has been eaten', () => {
    const sheepHerd = new SheepHerd(3, { x: 0, y: 0 }, 'vertical');

    expect(sheepHerd.attack({ x: 0, y: 0 })).toBe('eaten');
    expect(sheepHerd.attack({ x: 0, y: 1 })).toBe('eaten');
  });

  it('has been killed', () => {
    const sheepHerd = new SheepHerd(1, { x: 0, y: 0 }, 'horizontal');

    expect(sheepHerd.attack({ x: 0, y: 0 })).toBe('dead');
  });
});
