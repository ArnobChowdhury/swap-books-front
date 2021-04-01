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

export const ForgotPassWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceTen};
`;

export const ForgotPassLink = styled.a`
  font-size: ${({ theme }) => theme.fontSmall};
  color: ${({ theme }) => theme.colorPrimary1};
`;

export const LogoBox = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spaceTen};
`;
