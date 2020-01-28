import styled from 'styled-components';

export const LogoDiv = styled.div`
  text-align: center;
  padding-top: 4rem;
`;
export const BookDiv = styled.div`
  padding: 7rem;
  text-align: center;
`;
export const ContainerMain = styled.main`
  width: 100vw;
  height: 100vh;
  background: black;
`;

export const CopyDiv = styled.div`
  text-align: center;
  padding: 6rem 45rem 3rem 45rem;

  & header {
    color: ${(props): string => props.theme.colorYellowLight};
    font-size: 4rem;
    font-weight: 600;

    & span {
      color: ${(props): string => props.theme.colorYellowLight};
    }
  }

  & p {
    color: ${(props): string => props.theme.colorGreyPrimary};
    font-size: ${(props): string => props.theme.fontSizeThree};
  }
`;
