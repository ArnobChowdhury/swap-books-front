import React from 'react';
import { ColumnDiv } from './Grid.styles';

export interface GridColumnProps {
  children?: React.ReactNode;
  lg?: number | string | boolean;
  md?: number | string | boolean;
  padding?: number;
  sm?: number | string | boolean;
  xl?: number | string | boolean;
  xs?: number | string | boolean;
}

const GridColumn = ({
  children,
  lg,
  md,
  padding,
  sm,
  xl,
  xs,
}: GridColumnProps): JSX.Element => {
  const generateGrid = (gridSize: number | boolean | string): string => {
    let styles = '';

    if (gridSize === true) {
      styles = `
        flex-basis: 0;
        flex-grow: 1;
        max-width:  100%;`;
    } else if (gridSize === 'auto') {
      styles = `
        flex-basis: auto;
        flex-grow: 0;
        max-width: none;`;
    } else if (typeof gridSize === 'number' && gridSize <= 100) {
      styles = `
        flex-basis: ${gridSize}%;
        flex-grow: 0;
        max-width: ${gridSize}%;`;
    }

    return styles;
  };

  const generateCSS = (): string => {
    let cssString = '';

    cssString += xs ? generateGrid(xs) : '';
    cssString += sm ? `@media (min-width: 600px) ${generateGrid(sm)}` : '';
    cssString += md ? `@media (min-width: 960px) ${generateGrid(md)}` : '';
    cssString += lg ? `@media (min-width: 1280px) ${generateGrid(lg)}` : '';
    cssString += xl ? `@media (min-width: 1800px) ${generateGrid(xl)}` : '';

    return cssString;
  };

  return (
    <ColumnDiv {...{ padding }} {...{ gridCss: generateCSS() }}>
      {children ? children : null}
    </ColumnDiv>
  );
};

export default GridColumn;
