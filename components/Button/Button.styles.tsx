import styled, { css } from 'styled-components';

interface ButtonStyledProps {
  isYellow?: boolean;
}

const ButtonCSS = css<ButtonStyledProps>`
  background: ${(props): string | null =>
    props.isYellow ? props.theme.colorYellowDeep : 'transparent'};
  border: ${(props): string | null => (!props.isYellow ? '1px solid white' : null)};
  border-radius: ${(props): string | null => props.theme.spaceTwo};
  padding: ${(props): string | null =>
    `${props.theme.spaceFour} ${props.theme.spaceTen}`};
  font-family: inherit;
  font-size: ${(props): string | null => props.theme.fontSizeOne};
  color: ${(props): string | null =>
    props.isYellow ? props.theme.colorBlackDark : 'white'}; };
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
