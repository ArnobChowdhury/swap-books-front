import styled, { css } from 'styled-components';
import { ButtonProps } from './Button';

interface ButtonStyledProps {
  color: ButtonProps['color'];
  isFullWidth: boolean;
  lessPaddingOnLargeScreen: boolean;
}

const ButtonCSS = css<ButtonStyledProps>`
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  background: ${(props): string | null => {
    switch (props.color) {
      case 'white':
        return props.theme.colorWhite;
      case 'blue':
        return props.theme.colorPrimary2;
      default:
        return 'transparent';
    }
  }};
  border-radius: 0.3rem;
  border: ${({ theme, color }) => {
    switch (color) {
      case 'transparent':
        return `2px solid ${theme.colorPrimary2}`;
      default:
        return `2px solid transparent`;
    }
  }};
  padding: ${({ theme }) => `${theme.spaceThree} ${theme.spaceFive}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSmall};
  font-weight: 400;
  color: ${({ theme, color }): string | null => {
    switch (color) {
      case 'transparent':
        return theme.colorPrimary2;
      default:
        return theme.colorPrimary1;
    }
  }};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;

  @media (min-width: 360px) {
    padding: ${({ theme, lessPaddingOnLargeScreen }) =>
      !lessPaddingOnLargeScreen && `${theme.spaceFour} ${theme.spaceTen}`};
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
