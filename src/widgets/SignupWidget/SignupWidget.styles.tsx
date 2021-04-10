import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TryAgainButtonWrapper = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spaceTen};
`;
