import styled from 'styled-components';
import { mediumScreen, largeScreen } from 'mediaConfig';

export const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const PageContainer = styled.div<{
  largeTopMargin?: boolean;
  formPage?: boolean;
}>`
  max-width: ${({ formPage }) => (formPage ? '400px' : '600px')};
  margin-top: ${({ largeTopMargin }) => (largeTopMargin ? '103px' : '60px')};
  margin-bottom: 70px;
  width: 100%;

  @media (min-width: ${mediumScreen}px) {
    margin-top: 60px;
  }

  @media (min-width: ${largeScreen}px) {
    margin-bottom: 15px;
  }
`;
