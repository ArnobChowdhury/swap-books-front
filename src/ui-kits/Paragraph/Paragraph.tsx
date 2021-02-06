import { ReactNode } from 'react';
import { PTag } from './Paragraph.styles';

export interface ParagraphProps {
  children: ReactNode;
  marginBelow?: string;
  fontSize?: 'large' | 'small' | 'superSmall';
  fontWeight?: 'regular' | 'light';
  centerAlign?: boolean;
}

export const Paragraph = ({
  children,
  marginBelow,
  fontSize,
  centerAlign,
  fontWeight,
}: ParagraphProps): JSX.Element => {
  return (
    <PTag
      fontWeight={fontWeight}
      fontSize={fontSize}
      centerAlign={centerAlign}
      marginBelow={marginBelow}
    >
      {children}
    </PTag>
  );
};
