import styled from 'styled-components';
import { IconButtonProps } from './IconButton';

interface IconButtonStyledProps {
  textColor: IconButtonProps['textColor'];
  fontSize?: IconButtonProps['fontSize'];
  disabled?: IconButtonProps['disabled'];
  requestOngoing?: IconButtonProps['requestOngoing'];
}

export const StyledButton = styled.button<IconButtonStyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: ${({ theme }) => theme.colorWhite};
  padding: ${({ theme }): string | null => `${theme.spaceTwo} 0`};
  width: 165px;
  font-family: inherit;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  font-weight: 400;
  letter-spacing: 0.5px;
  color: ${({ textColor, theme }): string | null =>
    textColor === 'primary' ? theme.colorTextPrimary : theme.colorTextSecondary};
  cursor: ${({ requestOngoing }) => (requestOngoing ? 'wait' : 'pointer')};
  transition: all 0.2s;
  text-decoration: none;
  outline: none;

  &:disabled {
    pointer-events: ${({ requestOngoing }) => !requestOngoing && 'none'};
    opacity: 0.5;
  }

  &:hover {
    background: ${({ theme }) => theme.colorBG};
  }
`;

export const ButtonText = styled.div`
  padding-left: ${({ theme }) => theme.spaceThree};
`;
