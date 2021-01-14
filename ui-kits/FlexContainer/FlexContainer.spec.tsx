import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FlexContainer, FlexContainerProps } from './FlexContainer';
import { FlexItem } from '../FlexItem';

describe('<FlexContainer>', () => {
  let props: FlexContainerProps;
  beforeEach(() => {
    props = {
      direction: 'row',
    };
  });

  afterEach(cleanup);

  test('FlexContainer component should be in the dom', () => {
    const { container } = render(<FlexContainer></FlexContainer>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('FlexContainer should render with default styling when no prop is passed', () => {
    const { container } = render(<FlexContainer />);
    expect(container.firstChild).toHaveStyle('display: flex');
    expect(container.firstChild).toHaveStyle('flex-direction: row');
    expect(container.firstChild).toHaveStyle('flex-wrap: wrap');
    expect(container.firstChild).toHaveStyle('justify-content: flex-start');
    expect(container.firstChild).toHaveStyle('align-items: stretch');
    expect(container.firstChild).toHaveStyle('align-content: stretch');
  });

  test('FlexContainer should render with styling according to props passed', () => {
    props = {
      ...props,
      alignItems: 'center',
      alignContent: 'center',
      justify: 'flex-end',
      direction: 'column',
      wrap: 'nowrap',
    };
    const { container } = render(<FlexContainer {...props} />);
    expect(container.firstChild).toHaveStyle('flex-direction: column');
    expect(container.firstChild).toHaveStyle('flex-wrap: nowrap');
    expect(container.firstChild).toHaveStyle('justify-content: flex-end');
    expect(container.firstChild).toHaveStyle('align-items: center');
    expect(container.firstChild).toHaveStyle('align-content: center');
  });

  test('FlexContainer render with appropriate width and margin styling according to spacing prop', () => {
    props = {
      ...props,
      spacing: 5,
    };
    const { container } = render(<FlexContainer {...props} />);
    expect(container.firstChild).toHaveStyle('width: calc(100% + 10px)');
    expect(container.firstChild).toHaveStyle('margin: -5px');
  });

  test('FlexContainer should pass padding to Column components', () => {
    props = {
      ...props,
      spacing: 5,
    };
    const component = (
      <FlexContainer {...props}>
        <FlexItem></FlexItem>
      </FlexContainer>
    );
    const { getByTestId } = render(component);
    expect(getByTestId('FlexItemTestId')).toBeInTheDocument();
    expect(getByTestId('FlexItemTestId')).toHaveStyle('padding: 5px');
  });

  test('FlexContainer should render child that is valid React element but is not FlexItem', () => {
    const component = (
      <FlexContainer {...props}>
        <FlexItem></FlexItem>
        <div>Child but not a FlexItem</div>
      </FlexContainer>
    );
    const { getByTestId, getByText } = render(component);
    expect(getByTestId('FlexItemTestId')).toBeInTheDocument();
    expect(getByText('Child but not a FlexItem')).toBeInTheDocument();
  });

  test('FlexContainer should not render child that is not a valid React element', () => {
    const component = (
      <FlexContainer>
        <FlexItem></FlexItem>
        <div>Child but not a FlexItem</div>I should not be in the dom
      </FlexContainer>
    );
    const { queryByText } = render(component);
    expect(queryByText('I should not be in the dom')).not.toBeInTheDocument();
  });

  test('FlexItem components should render with its children', () => {
    const component = (
      <FlexContainer>
        <FlexItem>
          <div>First child </div>
          <div>Second child</div>
        </FlexItem>
      </FlexContainer>
    );
    const { getByText } = render(component);
    expect(getByText('First child')).toBeInTheDocument();
    expect(getByText('Second child')).toBeInTheDocument();
  });
});
