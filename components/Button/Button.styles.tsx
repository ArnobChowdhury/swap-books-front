import styled, { css } from 'styled-components';
import { ButtonProps } from './Button';

interface ButtonStyledProps {
  color: ButtonProps['color'];
}

const ButtonCSS = css<ButtonStyledProps>`
  background: ${(props): string | null => {
    switch (props.color) {
      case 'white':
        return props.theme.colorWhite;
      default:
        return props.theme.colorPink;
    }
  }};
  border: ${({ theme }) => `2px solid ${theme.colorPurple}`};
  border-radius: ${(props): string | null => props.theme.spaceTwo};
  padding: ${({ theme }): string | null => `${theme.spaceFour} ${theme.spaceTen}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSmall};
  font-weight: 400;
  letter-spacing: 1px;
  color: ${({ color, theme }): string | null =>
    color === 'white' ? theme.colorTextPrimary : 'black'};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    transform: translateY(-0.2rem);
  }
`;

export const ButtonBTag = styled.button<ButtonStyledProps>`
  ${ButtonCSS}
`;

export const ButtonATag = styled.a<ButtonStyledProps>`
  ${ButtonCSS}
`;
