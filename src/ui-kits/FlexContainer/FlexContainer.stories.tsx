import React from 'react';
import { FlexItem } from '../FlexItem';
import { InnerDiv } from './FlexContainer.styles';
import { FlexContainer, FlexContainerProps } from '.';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'FlexContainer',
  component: FlexContainer,
  argTypes: {
    alignContent: {
      control: {
        type: 'select',
        options: [
          'flex-start',
          'flex-end',
          'center',
          'space-between',
          'space-around',
          'stretch',
        ],
      },
      defaultValue: 'stretch',
    },
    alignItems: {
      control: {
        type: 'select',
        options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      },
      defaultValue: 'stretch',
    },
    justify: {
      control: {
        type: 'select',
        options: [
          'flex-start',
          'flex-end',
          'center',
          'space-evenly',
          'space-around',
          'space-between',
        ],
      },
      defaultValue: 'stretch',
    },
    direction: {
      control: {
        type: 'select',
        options: ['row', 'column', 'row-reverse', 'column-reverse'],
      },
      defaultValue: 'row',
    },
    wrap: {
      control: {
        type: 'select',
        options: ['wrap', 'nowrap', 'wrap-reverse'],
      },
      defaultValue: 'wrap',
    },
    spacing: {
      control: {
        type: 'number',
      },
      defaultValue: 8,
    },
  },
} as Meta;

export const Template: Story<FlexContainerProps> = (
  props: FlexContainerProps,
): JSX.Element => {
  return (
    <FlexContainer {...props}>
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
