import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colorPrimary1};

  @media (min-width: 1024px) {
    height: 100vh;
  }
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: center;
`;

export const NavContainer = styled.div`
  width: 100%;
  padding: 2rem 0 0 0;
  text-align: center;

  @media (min-width: 1024px) {
    width: 900px;
    text-align: left;
    padding: 4rem 0;
  }

  @media (min-width: 1366px) {
    width: 1200px;
  }
`;

export const PageMain = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const PageCFAContainer = styled.div`
  order: 2;
  flex-basis: 100%;
  display: flex;
  justify-content: center;

  @media (min-width: 1024px) {
    width: 450px;
    padding-top: 100px;
    order: 1;
    flex-basis: auto;
    display: block;
  }

  @media (min-width: 1366px) {
    width: 600px;
  }
`;

export const ContentWrapper = styled.div`
  width: 300px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & h1 {
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 35px;
    text-align: center;
  }

  & > p {
    font-size: 18px;
    color: ${({ theme }) => theme.colorWhite};
    font-weight: 400;
    text-align: center;
  }

  @media (min-width: 600px) {
    width: 450px;

    & h1 {
      text-align: center;
      font-size: 45px;
      font-weight: 900;
      letter-spacing: 1px;
    }

    & > p {
      font-size: ${({ theme }) => theme.fontHeader};
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    display: block;

    & h1 {
      text-align: left;
    }

    & > p {
      text-align: left;
    }
  }

  @media (min-width: 1366px) {
    width: 500px;
    & h1 {
      font-size: 55px;
    }
  }
`;

export const PageImageContainer = styled.div`
  text-align: center;
  padding-top: 0;
  order: 1;
  flex-basis: 100%;

  & > svg {
    width: 300px;
    height: 300px;
  }

  @media (min-width: 600px) {
    & > svg {
      width: 450px;
      height: 450px;
    }
  }

  @media (min-width: 1024px) {
    width: 450px;
    text-align: right;
    padding-top: 50px;
    order: 1;
    flex-basis: auto;

    & > svg {
      width: 450px;
    }
  }

  @media (min-width: 1366px) {
    width: 600px;
    padding-top: 70px;

    & > svg {
      width: 567px;
    }
  }
`;

export const ButtonContainer = styled.div`
  width: 250px;
  padding: ${({ theme }) => `40px 0`};
  text-align: center;

  & > p {
    color: ${({ theme }) => theme.colorPrimary2};
    font-weight: 400;
  }

  & > button {
    width: 100%;
    height: 42px;
    font-size: ${({ theme }) => theme.fontLarge};
  }

  @media (min-width: 600px) {
    width: 350px;
  }
`;

export const TopButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceSeven};

  & > button {
    width: 120px;
    height: 42px;
    font-size: ${({ theme }) => theme.fontLarge};
  }

  & > a {
    width: 120px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${({ theme }) => theme.fontLarge};
  }

  @media (min-width: 600px) {
    & > button {
      width: 165px;
    }

    & > a {
      width: 165px;
    }
  }
`;
