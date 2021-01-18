import { ReactNode } from 'react';
import { HOne } from './Header.styles';
export interface HeaderProps {
  children: ReactNode;
  marginBelow?: string;
}

export const Header = ({ children, marginBelow }: HeaderProps): JSX.Element => {
  return <HOne marginBelow={marginBelow}>{children}</HOne>;
};
