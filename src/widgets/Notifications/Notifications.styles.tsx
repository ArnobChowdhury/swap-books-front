import styled, { keyframes } from 'styled-components';
import { largeScreen } from 'mediaConfig';

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.colorWhite};
  padding: ${({ theme }) =>
    `${theme.spaceEight} ${theme.spaceEight} ${theme.spaceFour} ${theme.spaceEight}`};
  margin-top: ${({ theme }) => theme.spaceFive};
  box-shadow: ${({ theme }) => theme.boxShadow};

  @media (min-width: ${largeScreen}px) {
    max-height: 345px;
    padding: ${({ theme }) =>
      `${theme.spaceSix} ${theme.spaceSix} 0 ${theme.spaceSix}`};
    margin-top: 0;
    box-shadow: none;
  }
`;

const placeHolderShimmer = keyframes`
  0%{
    background-position: -468px 0
  }
  40%{
    background-position: 936px 0
  }
  100%{
    background-position: 468px 0
  }
`;

export const NotificationLoaderWrapper = styled.div`
  height: 6rem;
  width: 100%;
  padding: ${({ theme }) => theme.spaceFive};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  background: ${({ theme }) => theme.colorWhite};

  & .gradient {
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${placeHolderShimmer};
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #ddd 8%, #f4f4f4 38%, #ddd 54%);
    background-size: 1000px 640px;

    position: relative;
  }
`;

export const NotificationLoaderIcon = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spaceFive};
  background: ${({ theme }) => theme.colorBG};
`;

export const NotificationLoaderContent = styled.div`
  height: 100%;
  flex-grow: 1;
  background: ${({ theme }) => theme.colorBG};
`;
