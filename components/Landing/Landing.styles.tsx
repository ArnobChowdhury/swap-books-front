import styled from 'styled-components';

export const ContainerMain = styled.main`
  background: rgb(0, 0, 0);
`;

export const CopyDiv = styled.div`
  flex-basis: 100%;
  max-width: 100%;
  text-align: center;

  & header {
    color: ${(props): string => props.theme.colorYellowLight};
    font-size: 3rem;
    font-weight: 600;
  }

  & p {
    color: ${(props): string => props.theme.colorGreyPrimary};
    font-size: ${(props): string => props.theme.fontSizeOne};
  }
`;
export const LogoDiv = styled.div`
  flex-basis: 100%;
  flex-grow: 0;
  max-width: 100%;
  text-align: center;
  height: 20vh;
`;

export const ButtonDiv = styled.div`
  flex-basis: 50%;
  display: flex;
  justify-content: space-around;
  @media (min-width: 960px) {
    width: 30%;
  }
  @media (min-width: 1920px) {
    width: 8%;
  }
`;

export const BookDiv = styled.div`
  flex-basis: 100%;
  width: 100%;

  @media (min-width: 960px) {
    width: 50%;
  }
  @media (min-width: 1920px) {
    width: 40%;
  }
`;
