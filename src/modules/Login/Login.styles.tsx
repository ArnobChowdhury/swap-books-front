import styled from 'styled-components';

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
