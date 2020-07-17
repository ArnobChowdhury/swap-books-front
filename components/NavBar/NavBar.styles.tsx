import styled from 'styled-components';

export const NavContainer = styled.div`
  background: ${({ theme }) => theme.colorBlackLight};
  display: flex;
  justify-content: center;
`;

export const NavWrapper = styled.nav`
  width: 1400px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizeOne};
`;

export const NavUL = styled.ul`
  list-style-type: none;
  height: 100%;
`;

export const NavLinkWrapper = styled.li<{ isSelected: boolean }>`
  height: 100%;
  display: inline-block;
  transition: background 0.3s;
  border-bottom: ${({ isSelected, theme }) =>
    isSelected ? `4px solid ${theme.colorYellowDeep}` : `4px solid transparent`};
  &:hover {
    background: ${({ theme }) => theme.colorBlackPrimary};
  }
`;

export const NavLinks = styled.a<{ isSelected: boolean }>`
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spaceEight};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colorYellowDeep : 'white'};
`;
