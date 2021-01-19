import { ReactNode } from 'react';
import { PTag } from './Paragraph.styles';

export interface ParagraphProps {
  children: ReactNode;
  marginBelow?: string;
  fontLarge?: boolean;
  fontNormal?: boolean;
  centerAlign?: boolean;
}

export const Paragraph = ({
  children,
  marginBelow,
  fontLarge,
  centerAlign,
  fontNormal,
}: ParagraphProps): JSX.Element => {
  return (
    <PTag
      fontNormal={fontNormal}
      fontLarge={fontLarge}
      centerAlign={centerAlign}
      marginBelow={marginBelow}
    >
      {children}
    </PTag>
  );
};
