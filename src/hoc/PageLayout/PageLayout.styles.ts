import styled from 'styled-components';
import { mediumScreen } from 'mediaConfig';

export const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const PageContainer = styled.div`
  max-width: 700px;

  @media (min-width: ${mediumScreen}px) {
    margin-top: 60px;
  }
`;
