import styled from 'styled-components';

interface WrapperProps {
  seen: boolean;
  dataRoomLink: string;
}

export const Wrapper = styled.div.attrs(({ dataRoomLink }: WrapperProps) => ({
  dataRoomLink,
}))<WrapperProps>`
  padding: ${({ theme }) => `${theme.spaceSix} 0`};
  flex-basis: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colorWhite};
  font-size: ${({ theme }) => theme.fontSmall};
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-top: 1px solid ${({ theme }) => theme.colorSeparator};
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
  font-size: inherit;
  font-family: inherit;
  font-weight: 300;
  padding: ${({ theme }) => theme.spaceTwo};
  &:active {
    transform: translateY(1px);
  }
`;

export const LastModifiedStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSuperSmall};
  margin-left: ${({ theme }) => theme.spaceThree};
`;
