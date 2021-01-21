import styled from 'styled-components';

export const NavBarContainer = styled.div`
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
`;

export const NavBarWrapper = styled.nav`
  width: 250px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizeOne};
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

export const NavButton = styled.button<{ borderBottom: boolean }>`
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: ${({ theme, borderBottom }) =>
    `4px solid ${borderBottom ? theme.colorPurple : 'transparent'}`};
  outline: none;
`;

export const DropDown = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 65px;
  right: -6px;
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
  width: 400px;
  background: ${({ theme }) => theme.colorBG};
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: ${({ theme }) => theme.spaceTwo};
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
