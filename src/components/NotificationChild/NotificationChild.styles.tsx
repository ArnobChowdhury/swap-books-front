import styled from 'styled-components';

export const Wrapper = styled.div<{ seen: boolean }>`
  padding: ${({ theme }) => theme.spaceFive};
  flex-basis: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colorWhite};
  font-size: ${({ theme }) => theme.fontSizeMedium};
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: ${({ theme }) => theme.boxShadow};

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceTwo};
  }
`;

export const InterestedUserLink = styled.a`
  text-decoration: none;
`;

export const IconWrapper = styled.div`
  margin-right: ${({ theme }) => theme.spaceFive};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
`;

export const ChatButton = styled.button`
  background: ${({ theme }) => theme.colorGreen};
  border: none;
  border-radius: 3px;
  padding: ${({ theme }) => `0 ${theme.spaceFour}`};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.boxShadowOne};
  &:active {
    transform: translateY(1px);
  }
`;
