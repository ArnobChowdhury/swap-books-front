import styled from 'styled-components';

export const HOne = styled.h1<{ marginBelow?: string; largeFont: boolean }>`
  font-size: ${({ theme, largeFont }) => (largeFont ? '36px' : theme.fontHeader)};
  font-weight: 400;
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
`;
