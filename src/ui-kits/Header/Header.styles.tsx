import styled from 'styled-components';

export const HOne = styled.h1<{
  marginBelow?: string;
  headerFontSize?: number;
  headerColor?: string;
  largeFont: boolean;
}>`
  font-size: ${({ theme, headerFontSize, largeFont }) =>
    headerFontSize ? `${headerFontSize}px` : largeFont ? '36px' : theme.fontHeader};
  font-weight: 400;
  color: ${({ theme, headerColor }) =>
    headerColor ? headerColor : theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
`;
