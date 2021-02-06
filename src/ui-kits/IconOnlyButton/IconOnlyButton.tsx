import { StyledButton } from './IconOnlyButton.styles';
import { ReactNode, MouseEvent } from 'react';

interface IconOnlyButtonProps {
  children: ReactNode;
  size?: number;
  onClick: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

export const IconOnlyButton = ({ children, onClick, size }: IconOnlyButtonProps) => (
  <StyledButton onClick={onClick} size={size}>
    {children}
  </StyledButton>
);
