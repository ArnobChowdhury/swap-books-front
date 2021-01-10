import styled from 'styled-components';
import { IconButtonProps } from './IconButton';

interface IconButtonStyledProps {
  textColor: IconButtonProps['textColor'];
  fontSize?: IconButtonProps['fontSize'];
}

export const StyledButton = styled.button<IconButtonStyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: ${({ theme }) => theme.colorWhite};
  padding: ${({ theme }): string | null => `${theme.spaceFour} ${theme.spaceTen}`};
  font-family: inherit;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  font-weight: 300;
  letter-spacing: 1px;
  color: ${({ textColor, theme }): string | null =>
    textColor === 'primary' ? theme.colorTextPrimary : theme.textColorSecondary};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
`;

export const ButtonText = styled.div`
  padding-left: ${({ theme }) => theme.spaceFive};
`;
