import styled from 'styled-components';

export const ButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spaceTen};
  width: 100%;
  display: flex;
  justify-content: center;

  & button:first-child {
    margin-right: ${({ theme }) => theme.spaceFive};
  }

  & button:last-child {
    margin-left: ${({ theme }) => theme.spaceFive};
  }
`;
