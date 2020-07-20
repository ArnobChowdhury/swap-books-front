import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// todo think of a way to move this widths to theme
export const ContentContainer = styled.div<{ containerWidth?: number }>`
  width: ${({ containerWidth }) =>
    containerWidth ? `${containerWidth}px` : '600px'};
  flex-basis: ${({ containerWidth }) =>
    containerWidth ? `${containerWidth}px` : '600px'};
`;
