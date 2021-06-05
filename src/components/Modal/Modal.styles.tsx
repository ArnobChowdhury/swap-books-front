import styled, { css, keyframes } from 'styled-components';
import { mediumScreen, smallScreen } from '../../mediaConfig';

export const ModalDiv = styled.div<{
  opensInBottom?: boolean;
  largeModal?: boolean;
}>`
  width: ${({ largeModal, opensInBottom }) =>
    opensInBottom ? '100%' : largeModal ? '60vw' : '30vw'};
  min-width: 30rem;
  position: fixed;
  left: ${({ opensInBottom }) => (opensInBottom ? '0' : '50%')};
  top: ${({ largeModal, opensInBottom }) =>
    opensInBottom ? 'auto' : largeModal ? '50%' : '40%'};
  bottom: ${({ opensInBottom }) => opensInBottom && '0'};
  padding: 2rem;
  transform: ${({ opensInBottom }) => !opensInBottom && `translate(-50%, -50% )`};
  background: ${({ theme: { colorWhite } }): string | null => colorWhite};
  border-radius: ${(props): string | null => props.theme.spaceOne};
  z-index: 1200;
  box-shadow: 0.5rem 0.5rem 0.3rem rgba(10, 10, 10, 0.15);
  border-radius: ${({ opensInBottom, theme }) =>
    opensInBottom && `${theme.spaceTen} ${theme.spaceTen} 0 0`};

  @media screen and (min-width: ${smallScreen}px) {
    min-width: 35rem;
  }

  @media screen and (min-width: ${mediumScreen}px) {
    min-width: 55rem;
    padding: 3rem;
  }
`;

const ModalAndSliderCommonCss = css`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
`;

export const BackgroundDiv = styled.div`
  background: rgba(0, 0, 0, 0.8);
  left: 0;
  ${ModalAndSliderCommonCss}
`;

const slideLeft = keyframes`
  0% {
    right: -50%;
  }
  100% {
    right: 0%;
  }
`;

// TODO GET RID OF TS-IGNORE  AFTER STYLED COMPONENTS ARE UPDATED TO LATEST VERSION
//@ts-ignore
export const SliderBG = styled.div<{ closeSlider: boolean }>`
  ${ModalAndSliderCommonCss}
  background: #fff;
  padding-top: ${({ theme }) => theme.spaceTen};
  animation: ${slideLeft} 0.2s;
  ${({ closeSlider }) => closeSlider && `right: -100%;`};
  transition: right 0.1s linear;
`;

export const SliderContainer = styled.div`
  background: ${({ theme }) => theme.colorWhite};
  position: absolute;
  width: 100%;
  padding: 0 30px 30px 30px;
`;

export const LeftArrowContainer = styled.div`
  padding-left: 26px;
`;
