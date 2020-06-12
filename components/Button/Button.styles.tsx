import styled, { css } from 'styled-components';
import { ButtonProps } from './Button';

interface ButtonStyledProps {
  color: ButtonProps['color'];
  fontMedium: boolean;
}

const ButtonCSS = css<ButtonStyledProps>`
  background: ${(props): string | null => {
    switch (props.color) {
      case 'yellow':
        return props.theme.colorYellowDeep;
      case 'dark':
        return props.theme.colorBlackPrimary;
      default:
        return 'transparent';
    }
  }};
  border: ${({ color }): string | null =>
    color === 'transparent' ? '1px solid white' : '1px solid transparent'};
  border-radius: ${(props): string | null => props.theme.spaceTwo};
  padding: ${({ theme }): string | null => `${theme.spaceFour} ${theme.spaceTen}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSizeOne};
  font-weight:${({ fontMedium }): string | null => (fontMedium ? '500' : null)};
  color: ${({ color, theme }): string | null =>
    color === 'yellow' ? theme.colorBlackDark : 'white'}; };
  cursor: pointer;
  transition: all .2s;

  &:hover {
    transform: translateY(-.2rem);
  }
`;

export const ButtonBTag = styled.button<ButtonStyledProps>`
  ${ButtonCSS}
`;

export const ButtonATag = styled.a<ButtonStyledProps>`
  ${ButtonCSS}
`;
