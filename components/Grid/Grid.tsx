import { GridDiv } from './Grid.styles';
import GridColumn from './GridColumn';
import React from 'react';

export interface GridProps {
  alignContent?: string;
  alignItems?: string;
  children?: React.ReactNode;
  direction?: string;
  justify?: string;
  spacing?: number;
  wrap?: string;
}

const Grid = ({
  alignContent = 'stretch',
  alignItems = 'stretch',
  children,
  direction = 'row',
  justify = 'flex-start',
  spacing,
  wrap = 'wrap',
}: GridProps): JSX.Element => {
  let childrenArray;
  if (children) {
    childrenArray = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (
          typeof child.type === 'function' &&
          child.type.name === 'GridColumn'
        ) {
          return React.cloneElement(child, { padding: spacing });
        } else {
          return child;
        }
      } else {
        return null;
      }
    });
  }

  return (
    <GridDiv
      {...{ alignContent, alignItems, direction, justify, wrap, spacing }}
    >
      {childrenArray ? childrenArray : children ? children : null}
    </GridDiv>
  );
};

export default Grid;

Grid.column = GridColumn;
