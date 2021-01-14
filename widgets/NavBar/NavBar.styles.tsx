import styled from 'styled-components';

export const NavBarContainer = styled.div`
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
`;

export const NavBarWrapper = styled.nav`
  width: 1400px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizeOne};
  padding: ${({ theme }) => theme.spaceFour};
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

export const NavButton = styled.button`
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spaceEight};
`;

export const DropDown = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: 65px;
  right: 10px;
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
  width: 400px;
  background: white;
  border: ${({ theme }) => `1px solid ${theme.colorGreyPrimary}`};
  border-radius: 5px;
`;
