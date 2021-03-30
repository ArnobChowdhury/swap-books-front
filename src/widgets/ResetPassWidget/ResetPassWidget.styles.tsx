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

export const ReqMsg = styled.div`
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 26px;
`;

export const IconContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spaceSeven};
`;
