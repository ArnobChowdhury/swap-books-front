import styled from 'styled-components';
import { mediumScreen } from 'mediaConfig';

export const ActivityContainer = styled.div`
  display: flex;
  box-shadow: ${({ theme }) => theme.boxShadow};
  position: fixed;
  left: 0;
  top: 6.1rem;
  z-index: 1000;
  width: 100vw;

  @media (min-width: ${mediumScreen}px) {
    box-shadow: none;
    position: static;
    width: auto;
  }
`;

export const ActivitySections = styled.div<{ rightBorder?: boolean }>`
  flex-basis: 50%;
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  ${({ theme, rightBorder }) =>
    rightBorder && `border-right: 1px solid ${theme.colorSeparator}`};

  & button {
    width: 100%;
    &:hover {
      background: ${({ theme }) => theme.colorBG};
    }
  }

  @media (min-width: ${mediumScreen}px) {
    border-right: none;

    & button {
      width: 180px;
    }
  }
`;
