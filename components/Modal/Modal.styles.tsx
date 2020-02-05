import styled from 'styled-components';

export const ModalDiv = styled.div`
  width: 40vw;
  min-width: 65rem;
  position: fixed;
  left: 50%;
  top: 15%;
  padding: 5rem;
  transform: translate(-50%, 0%);
  background: ${(props): string | null => props.theme.colorYellowDeep};
  border-radius: ${(props): string | null => props.theme.spaceOne};
  z-index: 1200;
  box-shadow: 0.5rem 0.5rem 0.3rem rgba(10, 10, 10, 0.15);
`;

export const BackgroundDiv = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1100;
`;