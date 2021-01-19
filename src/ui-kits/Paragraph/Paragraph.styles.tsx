import styled from 'styled-components';

export const PTag = styled.p<{
  marginBelow?: string;
  centerAlign?: boolean;
  fontLarge?: boolean;
  fontNormal?: boolean;
}>`
  font-weight: ${({ fontNormal }) => (fontNormal ? '400' : '300')};
  font-size: ${({ theme, fontLarge }) =>
    fontLarge ? theme.fontLarge : theme.fontSmall};
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
  text-align: ${({ centerAlign }) => centerAlign && 'center'};
`;
