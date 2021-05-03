import styled from 'styled-components';
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
  transform: ${({ largeModal, opensInBottom }) =>
    !opensInBottom && `translate(-50%, ${largeModal ? '-50%' : '-60%'} )`};
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
