import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 100;
`;

const placeHolderShimmer = keyframes`
  0%{
    width: 0; 
    left: -10px;
  }

  10% {
    width: 10%; 
    left: 0;
  }

  40%{
    width: 40%;
    left: 40%;
  }

  90% {
    left: 100%;
  }

  100%{
    width: 0;
    left: 100%;
  }
`;

export const Shimmer = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colorSeparator};
  position: absolute;
  top: 0;

  & .loadingShimmer {
    width: 100%;
    height: 100%;
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${placeHolderShimmer};
    animation-timing-function: linear;
    background: ${({ theme }) => theme.colorPrimary2};
    position: relative;
  }
`;
