import { GridDiv } from './Grid.styles';
import GridColumn from './GridColumn';
import React from 'react';

type commonFlexProps = 'flex-end' | 'flex-start' | 'center';

type alignContentProps =
  | commonFlexProps
  | 'stretch'
  | 'space-between'
  | 'space-around';

type alignItemsProps = commonFlexProps | 'stretch' | 'baseline';

type justifyProps =
  | commonFlexProps
  | 'space-between'
  | 'space-evenly'
  | 'space-around';

export interface GridProps {
  alignContent?: alignContentProps;
  alignItems?: alignItemsProps;
  children?: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: justifyProps;
  spacing?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
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
      {childrenArray ? childrenArray : null}
    </GridDiv>
  );
};

export default Grid;

Grid.column = GridColumn;
