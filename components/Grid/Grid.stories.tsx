import React from 'react';
import { storiesOf } from '@storybook/react';
import Grid from './Grid';
import { GridInnerDiv } from './Grid.styles';

export const Default = (): JSX.Element => {
  return (
    <Grid spacing={4} alignItems="flex-start">
      <Grid.column xs={100} sm={50} md={75} lg={25} xl={20}>
        <GridInnerDiv>I am a grid</GridInnerDiv>
      </Grid.column>
      <Grid.column xs={100} sm={50} md={25} lg={25} xl={20}>
        <GridInnerDiv>I am a grid</GridInnerDiv>
      </Grid.column>
      <Grid.column xs={100} sm={50} md={25} lg={25} xl={20}>
        <GridInnerDiv>I am a grid</GridInnerDiv>
      </Grid.column>
      <Grid.column xs={100} sm={50} md={75} lg={25} xl={20}>
        <GridInnerDiv>I am a grid</GridInnerDiv>
      </Grid.column>
    </Grid>
  );
};

storiesOf('Grid', module).add('Default', () => <Default />);
