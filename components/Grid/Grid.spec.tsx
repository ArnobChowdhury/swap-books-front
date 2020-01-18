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

  test('Grid component should render with default styling when no prop is passed', () => {
    const { container } = render(<Grid />);
    expect(container.firstChild).toHaveStyle('display: flex');
    expect(container.firstChild).toHaveStyle('flex-direction: row');
    expect(container.firstChild).toHaveStyle('flex-wrap: wrap');
    expect(container.firstChild).toHaveStyle('justify-content: flex-start');
    expect(container.firstChild).toHaveStyle('align-items: stretch');
    expect(container.firstChild).toHaveStyle('align-content: stretch');
  });

  test('Grid component should render with styling according to props passed', () => {
    props = {
      ...props,
      alignItems: 'center',
      alignContent: 'center',
      justify: 'flex-end',
      direction: 'column',
      wrap: 'nowrap',
    };
    const { container } = render(<Grid {...props} />);
    expect(container.firstChild).toHaveStyle('flex-direction: column');
    expect(container.firstChild).toHaveStyle('flex-wrap: nowrap');
    expect(container.firstChild).toHaveStyle('justify-content: flex-end');
    expect(container.firstChild).toHaveStyle('align-items: center');
    expect(container.firstChild).toHaveStyle('align-content: center');
  });

  test('Grid component render with appropriate width and margin styling according to spacing prop', () => {
    props = {
      ...props,
      spacing: 5,
    };
    const { container } = render(<Grid {...props} />);
    expect(container.firstChild).toHaveStyle('width: calc(100% + 10px)');
    expect(container.firstChild).toHaveStyle('margin: -5px');
  });

  test('Grid component should pass padding to Grid.column components', () => {
    props = {
      ...props,
      spacing: 5,
    };
    const component = (
      <Grid {...props}>
        <Grid.column></Grid.column>
      </Grid>
    );
    const { getByTestId } = render(component);
    expect(getByTestId('gridColumnTestId')).toBeInTheDocument();
    expect(getByTestId('gridColumnTestId')).toHaveStyle('padding: 5px');
  });

  test('Grid components should render child that is valid React element but is not Grid.column', () => {
    const component = (
      <Grid {...props}>
        <Grid.column></Grid.column>
        <div>Child but not a Grid column</div>
      </Grid>
    );
    const { getByTestId, getByText } = render(component);
    expect(getByTestId('gridColumnTestId')).toBeInTheDocument();
    expect(getByText('Child but not a Grid column')).toBeInTheDocument();
  });

  test('Grid components should not render child that is not a valid React element', () => {
    const component = (
      <Grid>
        <Grid.column></Grid.column>
        <div>Child but not a Grid column</div>I should not be in the dom
      </Grid>
    );
    const { queryByText } = render(component);
    expect(queryByText('I should not be in the dom')).not.toBeInTheDocument();
  });

  test('Grid.column components should render with its children', () => {
    const component = (
      <Grid>
        <Grid.column>
          <div>First child </div>
          <div>Second child</div>
        </Grid.column>
      </Grid>
    );
    const { getByText } = render(component);
    expect(getByText('First child')).toBeInTheDocument();
    expect(getByText('Second child')).toBeInTheDocument();
  });
});
