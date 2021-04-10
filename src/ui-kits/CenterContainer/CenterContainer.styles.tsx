import styled from 'styled-components';

export const CenterContainer = styled.div<{ containerWidth?: number }>`
  width: 100%;
  flex-basis: 100%;
  background: ${({ theme }) => theme.colorWhite};
  padding: 4rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-top: ${({ theme }) => theme.spaceTen};

  & button {
    margin-top: ${({ theme }) => theme.spaceFive};
  }
`;
