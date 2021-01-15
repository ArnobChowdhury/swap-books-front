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
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  width: ${(props): string | null =>
    props.isFullWidth && props.labelAtTop ? '100%' : null};
  flex-grow: ${(props): string | null =>
    props.isFullWidth && !props.labelAtTop ? '1' : null};
  border: ${(props): string | null =>
    props.labelAtTop ? `1px solid ${props.theme.colorTextPrimary}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 22rem;
  min-height: 3.8rem;
  height: 3.8rem;
  color: ${(props): string | null => props.theme.colorBlackDark};
  margin-top: ${({ labelAtTop, theme }) => labelAtTop && theme.spaceFive};
  background: none;
  outline: none;

  &:focus {
    border: ${({ theme }) => `1px solid ${theme.colorPurple}`};
  }
`;
