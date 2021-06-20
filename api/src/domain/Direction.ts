export class Direction extends String {
  constructor(direction: 'horizontal' | 'vertical') {
    super(direction);
  }

  static create(rawData: any) {
    if (typeof rawData !== 'string') {
      throw new Error('Invalid direction format');
    }

    if (rawData !== 'horizontal' && rawData !== 'vertical') {
      throw new Error('Invalid direction format');
    }

    return new Direction(rawData);
  }

  isHorizontal(): boolean {
    return this.toString() === 'horizontal';
  }

  isVertical(): boolean {
    return this.toString() === 'vertical';
  }
}
