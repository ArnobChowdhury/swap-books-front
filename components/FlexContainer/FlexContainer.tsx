import { ContainerDiv } from './FlexContainer.styles';
import React, { ReactNode } from 'react';

export interface ContainerProps {
  alignContent?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around';
  alignItems?: 'flex-end' | 'flex-start' | 'center' | 'stretch' | 'baseline';
  children?: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';
  spacing?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}
/**
 * Create flex boxes with `FlexContainer` & `FlexItem` components with css breakpoints
 */
const FlexContainer = ({
  alignContent = 'stretch',
  alignItems = 'stretch',
  children,
  direction = 'row',
  justify = 'flex-start',
  spacing,
  wrap = 'wrap',
}: ContainerProps): JSX.Element => {
  let childrenArray;
  if (children) {
    childrenArray = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (
          typeof child.type === 'function' &&
          child.type.name === 'FlexItem'
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
    <ContainerDiv
      {...{ alignContent, alignItems, direction, justify, wrap, spacing }}
    >
      {childrenArray ? childrenArray : null}
    </ContainerDiv>
  );
};

export default FlexContainer;