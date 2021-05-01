import React from 'react';

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Meadow from './Meadow';

const getMeadow = (size: number) => Array.from(Array(size), () => new Array(size).fill('empty'));

describe('Meadow', () => {
  it('has an empty meadow', async () => {
    render(<Meadow size={3} meadow={getMeadow(3)} />);

    const emptyPlots = await screen.findAllByTestId(/empty$/);

    expect(emptyPlots).toHaveLength(9);
  });

  it('has a sheep at x: 0, y: 0 plot', async () => {
    const meadow = getMeadow(3);
    meadow[0][0] = 'sheep';

    render(<Meadow size={3} meadow={meadow} />);

    expect(screen.getByTestId('0:0-sheep'));
  });

  it('called addHerd with plot coordinates on plot click', () => {
    const mockOnPlotClick = jest.fn();

    render(<Meadow size={3} meadow={getMeadow(3)} onPlotClick={mockOnPlotClick} />);

    userEvent.click(screen.getByTestId('0:0-empty'));

    expect(mockOnPlotClick).toHaveBeenCalledWith({ plot: { x: 0, y: 0 } });
  });
});
