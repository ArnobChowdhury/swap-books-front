import styled from 'styled-components';

interface ButtonStyledProps {
  isYellow: boolean;
}

export const ButtonStyled = styled.a<ButtonStyledProps>`
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
`;
