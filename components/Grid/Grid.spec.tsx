import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Grid, { GridProps } from './Grid';

describe('<Grid>', () => {
  let props: GridProps;
  beforeEach(() => {
    props = {
      direction: 'row',
    };
  });

  afterEach(cleanup);

  test('Grid component should be in the dom', () => {
    const { container } = render(<Grid></Grid>);
    expect(container).toBeInTheDocument();
  });
  test('Grid component should have style flex-direction as row', () => {
    const { container, debug } = render(<Grid></Grid>);
    debug();
    expect(container).toHaveStyle('display: flex');
  });
});
