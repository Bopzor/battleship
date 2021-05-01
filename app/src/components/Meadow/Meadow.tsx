import React from 'react'

import './Meadow.css'

type PlotState = 'empty' | 'sheep';

type Plot = {
  x: number;
  y: number;
}

type MeadowProps = {
  meadow: PlotState[][];
  size?: number;
  onPlotClick?: (plot: Plot) => void;
};

const Meadow: React.FC<MeadowProps> = ({ size = 10, meadow, onPlotClick }) => {
  return (
    <div className="meadow">
      {meadow.map((row, y) => (
        <React.Fragment key={y}>
          {row.map((plot, x) => (
            <div data-testid={`${x}:${y}-${plot}`} key={x} className="plot" />
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Meadow;
