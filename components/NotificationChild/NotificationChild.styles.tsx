import styled from 'styled-components';

export const Wrapper = styled.div<{ seen: boolean }>`
  padding: ${({ theme }) => theme.spaceFive};
  flex-basis: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colorGreyLight};
  border: 1px solid rgb(255, 255, 255);
  font-size: ${({ theme }) => theme.fontSizeMedium};
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`;

export const InterestedUserLink = styled.a`
  text-decoration: none;
`;

export const IconWrapper = styled.div`
  width: 50px;
  min-width: 50px;
  height: 50px;
  background: rgb(255, 255, 255);
  margin-right: ${({ theme }) => theme.spaceFive};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
`;
