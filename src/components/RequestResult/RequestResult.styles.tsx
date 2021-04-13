import styled from 'styled-components';

export const Container = styled.div``;

export const ReqMsg = styled.div`
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 26px;
`;

export const IconContainer = styled.div<{ noBottomMarginAfterIcon?: boolean }>`
  text-align: center;
  margin-bottom: ${({ theme, noBottomMarginAfterIcon }) =>
    !noBottomMarginAfterIcon && theme.spaceSeven};
`;
