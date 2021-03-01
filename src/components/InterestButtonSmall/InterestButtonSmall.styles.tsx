import styled from 'styled-components';

export const Button = styled.button<{ requestOnGoing?: boolean }>`
  width: 60px;
  height: 60px;
  outline: none;
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: ${({ theme }) => `1px solid ${theme.colorPink}`};
  cursor: ${({ requestOnGoing }) => (requestOnGoing ? 'wait' : 'pointer')};
  transition: all 0.2s;

  &:active {
    transform: translateY(2%);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
