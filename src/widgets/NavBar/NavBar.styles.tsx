import styled, { css } from 'styled-components';
import { largeScreen } from 'mediaConfig';

export const NavBarContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  z-index: 1000;
  width: 100vw;
  border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};

  @media (min-width: ${largeScreen}px) {
    position: relative;
    bottom: auto;
    left: auto;
    box-shadow: none;
    width: auto;
  }
`;

export const NavBarWrapper = styled.nav`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: ${({ theme }) => theme.fontLarge};

  @media (min-width: ${largeScreen}px) {
    width: 250px;
    justify-content: space-between;
  }
`;

export const NavBarUL = styled.ul`
  list-style-type: none;
  height: 100%;
`;

export const NavButton = styled.button<{ borderBottom: boolean }>`
  position: relative;
  text-decoration: none;
  height: 100%;
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  border-top: ${({ theme, borderBottom }) =>
    `4px solid ${borderBottom ? theme.colorTextPrimary : 'transparent'}`};

  @media (min-width: ${largeScreen}px) {
    width: 60px;
    border-top: none;
    border-bottom: ${({ theme, borderBottom }) =>
      `4px solid ${borderBottom ? theme.colorTextPrimary : 'transparent'}`};
  }

  &:hover {
    background: ${({ theme }) => theme.colorBG};
  }
`;

export const DropDown = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 70px;
  right: 0;
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
  width: 400px;
  background: ${({ theme }) => theme.colorWhite};
  box-shadow: 0 4px 8px 6px rgb(100, 100, 100, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

export const Count = styled.div`
  position: absolute;
  top: 12%;
  right: 25%;
  width: ${({ theme }) => theme.spaceTen};
  height: ${({ theme }) => theme.spaceTen};
  border-radius: 50%;
  background: ${({ theme }) => theme.colorPrimary2};
  color: ${({ theme }) => theme.colorPrimary1};
  font-size: ${({ theme }) => theme.fontSmall};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${largeScreen}px) {
    right: 20%;
  }
`;
