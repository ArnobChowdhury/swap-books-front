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
const alignContent = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'stretch',
];

const alignItems = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'];

const justify = [
  'flex-start',
  'flex-end',
  'center',
  'space-evenly',
  'space-around',
  'space-between',
];

const direction = ['row', 'column', 'row-reverse', 'column-reverse'];

const wrap = ['wrap', 'nowrap', 'wrap-reverse'];

export const Default = (): JSX.Element => {
  return (
    <FlexContainer
      spacing={number('spacing', 8)}
      alignContent={
        select('alignContent', [...alignContent], 'stretch') as 'stretch'
      }
      alignItems={select('alignItems', [...alignItems], 'stretch') as 'stretch'}
      justify={select('justify', [...justify], 'center') as 'center'}
      direction={select('direction', [...direction], 'row') as 'row'}
      wrap={select('wrap', [...wrap], 'wrap') as 'wrap'}
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
