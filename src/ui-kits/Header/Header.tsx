import { ReactNode } from 'react';
import { HOne } from './Header.styles';
export interface HeaderProps {
  children: ReactNode;
  marginBelow?: string;
  largeFont?: boolean;
}

export const Header = ({
  children,
  marginBelow,
  largeFont = false,
}: HeaderProps): JSX.Element => {
  return (
    <HOne largeFont={largeFont} marginBelow={marginBelow}>
      {children}
    </HOne>
  );
};
