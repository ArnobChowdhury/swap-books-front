import styled from 'styled-components';
import { InputBoxProps } from './InputBox';

export const InputHTML = styled.input.attrs(props => {
  return {
    value: props.value,
    type: props.type,
    placeholder: props.placeholder,
  };
})<InputBoxProps>`
  display: ${(props): string | null => (props.labelAtTop ? 'block' : null)};
  padding: 0.4rem 0.8rem;
  border-radius: 0.2rem;
  border: 1px solid #424242;
  box-sizing: border-box;
  font-size: 1rem;
  font-family: inherit;
  width: ${(props): string | null =>
    props.isFullWidth && props.labelAtTop ? '100%' : null};
  flex-grow: ${(props): string | null =>
    props.isFullWidth && !props.labelAtTop ? '1' : null};
`;
