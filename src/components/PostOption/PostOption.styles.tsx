import styled from 'styled-components';

export const StyledButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  outline: none;
  height: ${({ theme }) => theme.spaceTen};
  width: ${({ theme }) => theme.spaceTen};
  border-radius: 50%;

  &:active {
    background: ${({ theme }) => theme.colorBG};
    border: 1px solid #cdcdcd;
  }
`;
