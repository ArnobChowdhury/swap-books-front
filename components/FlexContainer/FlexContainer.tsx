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
    | 'space-around'
    | 'stretch';
  spacing?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  height?: string;
}
/**
 * Create flex boxes with `FlexContainer` & `FlexItem` components with css breakpoints
 */
export const FlexContainer = ({
  alignContent = 'stretch',
  alignItems = 'stretch',
  children,
  direction = 'row',
  justify = 'flex-start',
  spacing,
  wrap = 'wrap',
  height,
}: ContainerProps): JSX.Element => {
  let childrenArray;
  if (children) {
    childrenArray = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (typeof child.type === 'function' && child.type.name === 'FlexItem') {
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
      {...(height ? { height } : {})}
    >
      {childrenArray ? childrenArray : null}
    </ContainerDiv>
  );
};
