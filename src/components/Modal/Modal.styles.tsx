import styled from 'styled-components';
import { mediumScreen, smallScreen } from '../../mediaConfig';

export const ModalDiv = styled.div<{ largeModal?: boolean }>`
  width: ${({ largeModal }) => (largeModal ? '60vw' : '30vw')};
  min-width: 30rem;
  position: fixed;
  left: 50%;
  top: ${({ largeModal }) => (largeModal ? '50%' : '40%')};
  padding: 2rem;
  transform: ${({ largeModal }) =>
    `translate(-50%, ${largeModal ? '-50%' : '-60%'} )`};
  background: ${({ theme: { colorWhite } }): string | null => colorWhite};
  border-radius: ${(props): string | null => props.theme.spaceOne};
  z-index: 1200;
  box-shadow: 0.5rem 0.5rem 0.3rem rgba(10, 10, 10, 0.15);

  @media screen and (min-width: ${smallScreen}px) {
    min-width: 35rem;
  }

  @media screen and (min-width: ${mediumScreen}px) {
    min-width: 55rem;
    padding: 3rem;
  }
`;

export const BackgroundDiv = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1100;
`;
