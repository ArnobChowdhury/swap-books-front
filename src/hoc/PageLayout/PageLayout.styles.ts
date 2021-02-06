import styled from 'styled-components';
import { mediumScreen, largeScreen } from 'mediaConfig';

export const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`;

export const PageContainer = styled.div`
  max-width: 600px;
  margin-top: 103px;
  margin-bottom: 70px;
  width: 100%;

  @media (min-width: ${mediumScreen}px) {
    margin-top: 60px;
  }

  @media (min-width: ${largeScreen}px) {
    margin-bottom: 15px;
  }
`;
