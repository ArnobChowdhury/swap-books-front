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
  border-radius: 0.3rem;
  border: ${({ theme }) => `2px solid ${theme.colorPurple}`};
  padding: ${({ theme }): string | null => `${theme.spaceThree} ${theme.spaceFive}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSmall};
  font-weight: 400;
  color: ${({ theme }): string | null => theme.colorTextDark};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  @media (min-width: 360px) {
    padding: ${({ theme }): string | null => `${theme.spaceFour} ${theme.spaceTen}`};
  }

  &:hover,
  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonBTag = styled.button<ButtonStyledProps>`
  ${ButtonCSS}
`;

export const ButtonATag = styled.a<ButtonStyledProps>`
  ${ButtonCSS}
`;
