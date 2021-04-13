import styled from 'styled-components';

export const StyledButton = styled.button<{ size?: number }>`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  outline: none;
  height: ${({ theme, size }) => (size ? `${size}px` : theme.spaceTen)};
  width: ${({ theme, size }) => (size ? `${size}px` : theme.spaceTen)};
  min-width: ${({ theme, size }) => (size ? `${size}px` : theme.spaceTen)};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spaceOne};

  &:active {
    background: ${({ theme }) => theme.colorBG};
    border: 1px solid #cdcdcd;
  }
`;
