import styled from 'styled-components';

export const LoginError = styled.div`
  padding: ${({ theme }) => theme.spaceFive};
  border: ${({ theme }) => `1px solid ${theme.colorAlert}`};
  background: ${({ theme }) => theme.colorAlertTransparent};
  color: ${({ theme }) => theme.colorAlert};
  font-size: ${({ theme }) => theme.fontSmall};
  border-radius: 3px;
  margin-bottom: ${({ theme }) => theme.spaceFive};
  font-weight: 400;
`;
