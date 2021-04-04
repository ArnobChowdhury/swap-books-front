import styled from 'styled-components';

// todo think of a way to move this widths to theme
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

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
