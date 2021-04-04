import styled from 'styled-components';
import { largeScreen, mediumScreen } from 'mediaConfig';

export const TopBarContainer = styled.div`
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;

export const TopBarWrapper = styled.div<{ isSignedIn: boolean }>`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontLarge};
  padding: ${({ theme }) => theme.spaceTen};
  ${({ isSignedIn }) =>
    `justify-content: ${isSignedIn ? 'center' : 'space-between'}`};

  @media (min-width: ${mediumScreen}px) {
    justify-content: space-between;
  }
`;

export const TopBarUL = styled.ul`
  list-style-type: none;
  height: 100%;
`;

export const ButtonWrapper = styled.div`
  & button:first-child {
    margin-right: ${({ theme }) => theme.spaceThree};
  }
`;
export const ItemWrapper = styled.div<{ itemAlign: 'left' | 'center' | 'right' }>`
  display: flex;
  justify-content: ${({ itemAlign }) => {
    if (itemAlign === 'left') {
      return 'flex-start';
    } else if (itemAlign === 'right') {
      return 'flex-end';
    } else {
      return 'center';
    }
  }};

  @media screen and (min-width: ${largeScreen}px) {
    width: 33%;
  }
`;
