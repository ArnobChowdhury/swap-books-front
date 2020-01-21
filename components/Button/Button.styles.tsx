import styled from 'styled-components';
import { ButtonProps } from './Button';

interface ButtonStyledProps {
  isYellow: boolean;
}

export const ButtonStyled = styled.a<ButtonStyledProps>`
  background: ${(props): string | null =>
    props.isYellow ? props.theme.colorYellowDeep : 'transparent'};
  border-radius: ${(props): string | null => props.theme.spaceTwo};
  padding: ${(props): string | null => `${props.theme.spaceFour} ${props.theme.spaceTen}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSizeOne};
`;
