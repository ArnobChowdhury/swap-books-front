import React from 'react';
import { storiesOf } from '@storybook/react';
import Grid from './Grid';

export const Default = (): JSX.Element => {
  return (
    <Grid>
      <Grid.column xs={50}>I am a grid</Grid.column>
      <Grid.column xs="auto">I am a grid</Grid.column>
    </Grid>
  );
};

storiesOf('Grid', module).add('Default', () => <Default />);
