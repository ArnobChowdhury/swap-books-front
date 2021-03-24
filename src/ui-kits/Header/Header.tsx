import { ReactNode } from 'react';
import { HOne } from './Header.styles';
export interface HeaderProps {
  children: ReactNode;
  marginBelow?: string;
  largeFont?: boolean;
  headerFontSize?: number;
  headerColor?: string;
}

export const Header = ({
  children,
  marginBelow,
  largeFont = false,
  headerFontSize,
  headerColor,
}: HeaderProps): JSX.Element => {
  return (
    <HOne
      headerFontSize={headerFontSize}
      largeFont={largeFont}
      marginBelow={marginBelow}
      headerColor={headerColor}
    >
      {children}
    </HOne>
  );
};
