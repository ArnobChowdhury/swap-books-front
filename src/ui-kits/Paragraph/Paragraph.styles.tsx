import styled from 'styled-components';
import { ParagraphProps } from './Paragraph';

export const PTag = styled.p<{
  marginBelow?: string;
  centerAlign?: boolean;
  fontSize?: ParagraphProps['fontSize'];
  fontWeight?: ParagraphProps['fontWeight'];
}>`
  font-weight: ${({ fontWeight }) => (fontWeight === 'regular' ? '400' : '300')};
  font-size: ${({ theme, fontSize }) => {
    switch (fontSize) {
      case 'large':
        return theme.fontLarge;
      case 'small':
        return theme.fontSmall;
      case 'superSmall':
        return theme.fontSuperSmall;
    }
  }};
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
  text-align: ${({ centerAlign }) => centerAlign && 'center'};
`;
