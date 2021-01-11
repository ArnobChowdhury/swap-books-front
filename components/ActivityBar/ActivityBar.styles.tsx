import styled from 'styled-components';

export const ActivityContainer = styled.div`
  display: flex;
`;

export const ActivitySections = styled.div<{ rightBorder?: boolean }>`
  flex-basis: 50%;
  background: ${({ theme }) => theme.colorWhite};
  ${({ theme, rightBorder }) =>
    rightBorder && `border-right: 1px solid ${theme.colorSeparator}`};
  display: flex;
  justify-content: center;
`;
