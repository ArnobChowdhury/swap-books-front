import styled from 'styled-components';
import { mediumScreen } from 'mediaConfig';

export const ActivityContainer = styled.div`
  display: flex;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  @media (min-width: ${mediumScreen}px) {
    box-shadow: none;
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
