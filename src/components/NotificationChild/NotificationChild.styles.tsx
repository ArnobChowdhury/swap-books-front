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
  font-weight: 400;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-top: 1px solid ${({ theme }) => theme.colorSeparator};
  line-height: 25px;
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

export const ActivityButton = styled.button<{
  isAlert?: boolean;
  noLeftMargin?: boolean;
  reqOnGoing?: boolean;
}>`
  background: ${({ theme, isAlert }) =>
    isAlert ? theme.colorAlert : theme.colorPrimary3};
  color: ${({ theme, isAlert }) =>
    isAlert ? theme.colorWhite : theme.colorPrimary1};
  border: none;
  border-radius: 3px;
  margin: ${({ theme, noLeftMargin }) =>
    noLeftMargin ? `0 ${theme.spaceTwo} 0 0` : `0 ${theme.spaceTwo}`};
  padding: ${({ theme }) => `${theme.spaceOne} ${theme.spaceSix}`};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.boxShadow};
  font-size: inherit;
  font-family: inherit;
  font-weight: 400;
  opacity: ${({ reqOnGoing }) => (reqOnGoing ? '.5' : '1')};
  pointer-events: ${({ reqOnGoing }) => (reqOnGoing ? 'none' : 'auto')};

  &:active {
    transform: translateY(1px);
  }
`;

export const LastModifiedStyled = styled.span`
  font-size: ${({ theme }) => theme.fontSuperSmall};
  display: inline-block;
`;

export const Emphasis = styled.i`
  color: ${({ theme }) => theme.colorTextSecondary};
`;
