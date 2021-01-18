import { ReactNode } from 'react';
import { PTag } from './Paragraph.styles';

export interface ParagraphProps {
  children: ReactNode;
  marginBelow?: string;
}

export const Paragraph = ({
  children,
  marginBelow,
}: ParagraphProps): JSX.Element => {
  return <PTag marginBelow={marginBelow}>{children}</PTag>;
};
