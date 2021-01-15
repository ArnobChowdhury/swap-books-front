import styled from 'styled-components';

export const TopBarContainer = styled.div`
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
`;

export const TopBarWrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizeOne};
  padding: ${({ theme }) => theme.spaceTen};
`;

export const TopBarUL = styled.ul`
  list-style-type: none;
  height: 100%;
`;

export const TopBarLinkWrapper = styled.li<{ isSelected: boolean }>`
  height: 100%;
  display: inline-block;
  transition: background 0.3s;
  border-bottom: ${({ isSelected, theme }) =>
    isSelected ? `4px solid ${theme.colorYellowDeep}` : `4px solid transparent`};
  &:hover {
    background: ${({ theme }) => theme.colorBlackPrimary};
  }
`;

export const TopBarLinks = styled.a<{ isSelected: boolean }>`
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spaceEight};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colorYellowDeep : 'white'};
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

export const ButtonWrapper = styled.div`
  & button:first-child {
    margin-right: ${({ theme }) => theme.spaceThree};
  }
`;
export const ItemWrapper = styled.div<{ itemAlign: 'left' | 'center' | 'right' }>`
  width: 33%;
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
`;
