import React, { ReactNode } from 'react';
import { FlexItemDiv } from './FlexItem.styles';

export interface FlexItemProps {
  children?: ReactNode;
  lg?: number | 'auto' | boolean;
  md?: number | 'auto' | boolean;
  padding?: number;
  sm?: number | 'auto' | boolean;
  xl?: number | 'auto' | boolean;
  defaultSize?: number | 'auto' | boolean;
  width?: string;
  height?: string;
}

export const FlexItem = ({
  children,
  lg,
  md,
  padding,
  sm,
  xl,
  defaultSize,
  width,
  height,
}: FlexItemProps): JSX.Element => {
  const generateFlexItem = (size: number | boolean | string): string => {
    let styles = '';

    if (size === true) {
      styles = `
        flex-basis: 0;
        flex-grow: 1;
        max-width:  100%;`;
    } else if (size === 'auto') {
      styles = `
        flex-basis: auto;
        flex-grow: 0;
        max-width: none;`;
    } else if (typeof size === 'number' && size <= 100) {
      styles = `
        flex-basis: ${size}%;
        flex-grow: 0;
        max-width: ${size}%;`;
    }

    return styles;
  };

  const generateCSS = (): string => {
    let cssString = '';

    cssString += defaultSize ? generateFlexItem(defaultSize) : '';
    cssString += sm ? `@media (min-width: 600px) {${generateFlexItem(sm)}}` : '';
    cssString += md ? `@media (min-width: 960px) {${generateFlexItem(md)}}` : '';
    cssString += lg ? `@media (min-width: 1280px) {${generateFlexItem(lg)}}` : '';
    cssString += xl ? `@media (min-width: 1920px) {${generateFlexItem(xl)}}` : '';

    return cssString;
  };

  return (
    <FlexItemDiv
      {...{ padding }}
      {...{ flexCss: generateCSS() }}
      {...(width ? { width } : {})}
      {...(height ? { height } : {})}
      data-testid="FlexItemTestId"
    >
      {children ? children : null}
    </FlexItemDiv>
  );
};
