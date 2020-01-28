import { cleanup, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Input, { InputProps } from './Input';

describe('<Input />,', () => {
  let props: InputProps;
  beforeEach(() => {
    props = {
      labelText: 'First Name',
      type: 'text',
      value: 'First Name',
      onChangeFunc: (): void => {},
    };
  });

  afterEach(cleanup);

  test('Input component should be in the dom', () => {
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('inputLabelTestid')).toBeInTheDocument();
  });
  test('Input component should pass the type to InputBox component', () => {
    props = { ...props, type: 'password' };
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('inputFieldTestid')).toHaveAttribute('type', 'password');
  });
  test("Input field's width should be 100% when isFullWidth & labelAtTop prop is true", () => {
    props = { ...props, inputFieldFullWidth: true, labelAtTop: true };
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('inputFieldTestid')).toHaveStyle('width: 100%');
  });
  test("Input field's flex-grow style should be set to 1 when isFullWidth is true but labelAtTop prop is false", () => {
    props = { ...props, inputFieldFullWidth: true, labelAtTop: false };
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('inputFieldTestid')).toHaveStyle('flex-grow: 1');
  });
  test("Input field's border should be 'none' when labelAtTop is false", () => {
    props = { ...props, labelAtTop: false };
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId('inputFieldTestid')).toHaveStyle('border: none');
  });
  test("Input component's onChange function should work as expected", () => {
    const mockOnchange = jest.fn();
    const { container } = render(<Input {...props} onChangeFunc={mockOnchange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'example@example.com' },
    });
    expect(mockOnchange).toHaveBeenCalledTimes(1);
  });
});
