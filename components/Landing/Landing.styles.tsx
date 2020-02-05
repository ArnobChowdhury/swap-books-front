import styled from 'styled-components';

export const ContainerMain = styled.main`
  background: rgb(0, 0, 0);
`;

export const CopyDiv = styled.div`
  flex-basis: 100%;
  max-width: 100%;
  text-align: center;
  height: 35vh;
  display: flex;
  flex-wrap: wrap;
  align-content: center;

  @media (min-width: 600px) {
    height: 30vh;
  }
  @media (min-width: 960px) {
    height: 25vh;
  }

  & header {
    flex-basis: 100%;
    width: 100%;
    color: ${(props): string => props.theme.colorYellowLight};
    font-size: 3rem;
    font-weight: 600;
    padding: ${(props): string => props.theme.spaceTen} 0;
    @media (min-width: 600px) {
      font-size: 3.5rem;
    }
    @media (min-width: 1920px) {
      font-size: 4.5rem;
    }
  }

  & p {
    flex-basis: 100%;
    color: ${(props): string => props.theme.colorGreyPrimary};
    font-size: ${(props): string => props.theme.fontSizeOne};

    @media (min-width: 600px) {
      font-size: ${(props): string => props.theme.fontSizeTwo};
    }
    @media (min-width: 1920px) {
      font-size: ${(props): string => props.theme.fontSizeThree};
    }
  }
`;
export const LogoDiv = styled.div`
  flex-basis: 100%;
  flex-grow: 0;
  max-width: 100%;
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const ButtonDiv = styled.div`
  flex-basis: 80%;
  display: flex;
  justify-content: space-around;
  align-content: flex-start;
  align-items: center;
  height: 10vh;
  @media (min-width: 600px) {
    align-items: start;
  }
  @media (min-width: 960px) {
    flex-basis: 50%;
    align-items: start;
  }
  @media (min-width: 1920px) {
    flex-basis: 40%;
    width: 5%;
  }
`;

export const BookDiv = styled.div`
  flex-basis: 100%;
  width: 100%;
  height: 30vh;

  @media (min-width: 600px) {
    height: 40vh;
  }

  @media (min-width: 960px) {
    width: 50%;
  }
  @media (min-width: 1920px) {
    width: 40%;
  }
`;
