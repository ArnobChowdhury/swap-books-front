import React from 'react';
import { withKnobs, number, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import FlexItem from '../FlexItem';
import { InnerDiv } from './FlexContainer.styles';
import FlexContainer from '.';

export default {
  title: 'FlexContainer',
  component: FlexContainer,
  subcomponents: { FlexItem },
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Layout pages or use this for flex boxes',
  },
};

export const Default = (): JSX.Element => {
  const alignContent = select(
    'alignContent',
    [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'stretch',
    ],
    'stretch',
  );
  const alignItems = select(
    'alignItems',
    ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    'stretch',
  );
  const direction = select(
    'direction',
    ['row', 'column', 'row-reverse', 'column-reverse'],
    'row',
  );
  const justify = select(
    'justify',
    [
      'flex-start',
      'flex-end',
      'center',
      'space-evenly',
      'space-around',
      'space-between',
    ],
    'flex-start',
  );
  const spacing = number('spacing', 8);
  const wrap = select('wrap', ['wrap', 'nowrap', 'wrap-reverse'], 'wrap');

  return (
    <FlexContainer
      spacing={spacing}
      alignContent={alignContent}
      alignItems={alignItems}
      justify={justify}
      direction={direction}
      wrap={wrap}
    >
      <FlexItem defaultSize={100} sm={50} md={75} lg={25} xl={20}>
        <InnerDiv>I am a flex item</InnerDiv>
      </FlexItem>
      <FlexItem defaultSize={100} sm={50} md={25} lg={25} xl={20}>
        <InnerDiv>I am a flex item</InnerDiv>
      </FlexItem>
      <FlexItem defaultSize={100} sm={50} md={25} lg={25} xl={20}>
        <InnerDiv>I am a flex item</InnerDiv>
      </FlexItem>
      <FlexItem defaultSize={100} sm={50} md={75} lg={25} xl={20}>
        <InnerDiv>I am a flex item</InnerDiv>
      </FlexItem>
    </FlexContainer>
  );
};
