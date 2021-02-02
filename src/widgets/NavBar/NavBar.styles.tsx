import styled from 'styled-components';
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
  box-shadow: 0 -1px 2px rgb(0, 0, 0, 0.2);

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
  font-size: ${({ theme }) => theme.fontSizeOne};

  @media (min-width: ${largeScreen}px) {
    width: 250px;
    justify-content: space-between;
  }
`;

export const NavBarUL = styled.ul`
  list-style-type: none;
  height: 100%;
`;

export const NavBarLinkWrapper = styled.li<{ isSelected: boolean }>`
  height: 100%;
  display: inline-block;
  transition: background 0.3s;
  border-bottom: ${({ isSelected, theme }) =>
    isSelected ? `4px solid ${theme.colorYellowDeep}` : `4px solid transparent`};
  &:hover {
    background: ${({ theme }) => theme.colorBlackPrimary};
  }
`;

export const NavButton = styled.button<{
  borderBottom: boolean;
  buttonType: 'Messages' | 'Notifications' | 'Posts' | 'User';
}>`
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
  border-top: ${({ theme, borderBottom, buttonType }) => {
    let color;
    if (buttonType === 'Messages') {
      color = theme.colorGreen;
    } else if (buttonType === 'Notifications') {
      color = theme.colorPink;
    } else if (buttonType === 'Posts') {
      color = theme.colorPurple;
    } else {
      color = theme.colorLogo;
    }
    return `4px solid ${borderBottom ? color : 'transparent'}`;
  }};

  @media (min-width: ${largeScreen}px) {
    width: 60px;
    border-top: none;
    border-bottom: ${({ theme, borderBottom, buttonType }) => {
      let color;
      if (buttonType === 'Messages') {
        color = theme.colorGreen;
      } else if (buttonType === 'Notifications') {
        color = theme.colorPink;
      } else if (buttonType === 'Posts') {
        color = theme.colorPurple;
      } else {
        color = theme.colorLogo;
      }
      return `4px solid ${borderBottom ? color : 'transparent'}`;
    }};
  }

  &:hover {
    background: ${({ theme }) => theme.colorBG};
  }
`;

export const DropDown = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 70px;
  right: -6px;
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
  width: 400px;
  background: ${({ theme }) => theme.colorWhite};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: ${({ theme: { spaceFour } }) => `${spaceFour} 0 0 ${spaceFour}`};
`;

export const UserIcon = styled.div`
  width: 32px;
  height: 32px;
  border: ${({ theme }) => `2px solid ${theme.colorTextPrimary}`};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colorTextPrimary};
  font-family: inherit;
`;

export const Count = styled.div<{ buttonType: 'Messages' | 'Notification' }>`
  position: absolute;
  top: 12%;
  right: 25%;
  width: ${({ theme }) => theme.spaceTen};
  height: ${({ theme }) => theme.spaceTen};
  border-radius: 50%;
  background: ${({ theme, buttonType }) =>
    buttonType === 'Messages' ? theme.colorGreen : theme.colorPink};
  color: ${({ theme }) => theme.colorTextDark};
  font-size: ${({ theme }) => theme.fontSmall};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${largeScreen}px) {
    right: 20%;
  }
`;
