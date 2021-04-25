import styled from 'styled-components';

export const IconRotator = styled.button<{ rotateOneEighty?: boolean }>`
  height: ${({ theme }) => theme.spaceSeven};
  width: ${({ theme }) => theme.spaceSeven};
  border: ${({ theme }) => `1px solid ${theme.colorTextPrimary}`};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  margin-left: ${({ theme }) => theme.spaceTwo};
  transform: ${({ rotateOneEighty }) => rotateOneEighty && 'rotate(180deg)'};
  outline: none;

  &:hover {
    background: ${({ theme }) => theme.colorBG};
    cursor: pointer;
  }

  &:active {
    background: ${({ theme }) => theme.colorSeparator};
  }
`;
