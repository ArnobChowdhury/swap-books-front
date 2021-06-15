import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colorLogoBlue};
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    margin-top: 20px;
  }
`;
