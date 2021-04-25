import styled, { keyframes } from 'styled-components';

const LDSAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const TransparentBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

export const LDSRing = styled.div<{ big: boolean }>`
  display: inline-block;
  position: relative;
  width: ${({ big }) => (big ? '50px' : '40px')};
  height: ${({ big }) => (big ? '50px' : '40px')};

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ big }) => (big ? '32px' : '24px')};
    height: ${({ big }) => (big ? '32px' : '24px')};
    margin: 8px;
    border: ${({ theme, big }) =>
      `${big ? '4px' : '2px'} solid ${theme.colorPrimary3}`};
    border-radius: 50%;
    animation: ${LDSAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ theme }) => theme.colorPrimary3} transparent transparent
      transparent;
  }

  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
