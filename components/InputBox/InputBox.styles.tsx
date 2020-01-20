import styled from 'styled-components';
import { InputBoxProps } from './InputBox';

export const InputHTML = styled.input.attrs(props => {
  return {
    value: props.value,
    type: props.type,
    placeholder: props.placeholder,
  };
})<InputBoxProps>`
  padding: 8px 10px;
  border-radius: 2px;
  border: 1px solid #424242;
  box-sizing: border-box;
  font-size: 1rem;
  width: ${(props): string | null => (props.isFullWidth ? '100%' : null)};
`;
