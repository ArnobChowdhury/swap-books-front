import styled from 'styled-components';

export const ActivityContainer = styled.div`
  display: flex;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const ActivitySections = styled.div<{ rightBorder?: boolean }>`
  flex-basis: 50%;
  background: ${({ theme }) => theme.colorWhite};
  display: flex;
  justify-content: center;
  ${({ theme, rightBorder }) =>
    rightBorder && `border-right: 1px solid ${theme.colorSeparator}`};

  & button {
    width: 100%;
  }
`;
