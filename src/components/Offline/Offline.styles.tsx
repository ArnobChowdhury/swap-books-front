import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > h1 {
    margin-top: ${({ theme }) => theme.spaceTen};
  }
`;

export const SignalWrapper = styled.div`
  padding: 40px;
  border-radius: 100%;
  background: ${({ theme }) => theme.colorWhite};
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

export const LogoWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: ${({ theme }) => theme.colorWhite};
  padding: ${({ theme }) => theme.spaceFive};
  text-align: center;
`;
