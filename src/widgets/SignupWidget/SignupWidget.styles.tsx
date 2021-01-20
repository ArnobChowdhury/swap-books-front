import styled from 'styled-components';
import { smallScreen } from 'mediaConfig';

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;

  @media (min-width: ${smallScreen}px) {
    padding: 8rem;
  }
`;

// todo think of a way to move this widths to theme
export const CenterContainer = styled.div<{ containerWidth?: number }>`
  width: 100vw;
  flex-basis: 100%;
  background: ${({ theme }) => theme.colorWhite};
  padding: 4rem;
  box-shadow: ${({ theme }) => theme.boxShadow};

  @media (min-width: ${smallScreen}px) {
    width: 40rem;
    flex-basis: 40rem;
  }

  & button {
    margin-top: ${({ theme }) => theme.spaceFive};
  }
`;
