import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-top: ${({ theme }) => theme.spaceFive};
`;

export const SingleTab = styled.div<{ size: number; isSelected: boolean }>`
  flex-basis: ${({ size }) => `${size}%`};
  color: ${({ theme, isSelected }) => isSelected && theme.colorPrimary1};
  background: ${({ theme }) => theme.colorWhite};
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  padding: ${({ theme }) => theme.spaceEight};
  text-align: center;
  border-bottom: ${({ theme, isSelected }) =>
    isSelected && `5px solid ${theme.colorPrimary1}`};
  border-top: 5px solid transparent;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colorSeparator};
  }
`;
