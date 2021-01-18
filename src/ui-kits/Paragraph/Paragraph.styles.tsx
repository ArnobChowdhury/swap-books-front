import styled from 'styled-components';

export const PTag = styled.p<{ marginBelow?: string }>`
  font-weight: 300;
  font-size: ${({ theme }) => theme.fontSmall};
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-bottom: ${({ marginBelow }) => marginBelow};
`;
