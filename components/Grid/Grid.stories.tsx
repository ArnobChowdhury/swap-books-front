import React from 'react';
import { withKnobs, number, select } from '@storybook/addon-knobs';
import Grid from './Grid';
import { GridInnerDiv } from './Grid.styles';

export default {
  title: 'Grid',
  component: Grid,
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
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
  const spacing = number('spacing', 2);
  const wrap = select('wrap', ['wrap', 'nowrap', 'wrap-reverse'], 'wrap');

  return (
    <Grid
      spacing={spacing}
      alignContent={alignContent}
      alignItems={alignItems}
      justify={justify}
      direction={direction}
      wrap={wrap}
    >
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
