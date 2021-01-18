import styled from 'styled-components';

export const HOne = styled.h1<{ marginBelow?: string }>`
  font-size: ${({ theme }) => theme.fontHeader};
  font-weight: 400;
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
`;
