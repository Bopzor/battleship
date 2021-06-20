export class Cell {
  constructor(readonly x: number, readonly y: number) {}

  static create(rawData: any) {
    if (
      rawData === null ||
      typeof rawData !== 'object' ||
      typeof rawData.x !== 'number' ||
      typeof rawData.y !== 'number'
    ) {
      throw new Error('Invalid cell format.');
    }

    return new Cell(rawData.x, rawData.y);
  }
}
