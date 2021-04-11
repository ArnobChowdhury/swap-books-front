import React, { useContext } from 'react';
import Link from 'next/link';
import {
  Container,
  Nav,
  NavContainer,
  PageMain,
  PageCFAContainer,
  ContentWrapper,
  PageImageContainer,
  ButtonContainer,
  TopButtons,
} from './LandingPage.styles';
import { Logo } from 'assets/Logo';
import { LandingImage } from 'assets/LandingImage';
import { Header } from 'ui-kits/Header';
import { Paragraph } from 'ui-kits/Paragraph';
import { Button } from 'ui-kits/Button';
import theme from 'theme';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { authErrorRefresh } from 'redux/actions/auth';
import { useDispatch } from 'react-redux';

export const LandingPage = (): JSX.Element => {
  const { colorPrimary2, spaceFive, spaceSeven } = theme;
  const rootContext = useContext(RootContext);
  const { setPopupType, setShowModal } = rootContext as RootContextProps;

  const dispatch = useDispatch();
  const handleLoginButtonClick = () => {
    dispatch(authErrorRefresh());
    setShowModal(true);
    setPopupType('login');
  };

  const handleLocationButtonClick = () => {
    setShowModal(true);
    setPopupType('location');
  };

  return (
    <Container>
      <Nav>
        <NavContainer>
          <Logo width={150} />
        </NavContainer>
      </Nav>
      <PageMain>
        <PageCFAContainer>
          <ContentWrapper>
            <Header
              marginBelow={spaceFive}
              headerColor={colorPrimary2}
              headerFontSize={55}
            >
              Stop! This site is under development and not ready to be used
            </Header>
            <Paragraph fontSize="large">
              Choose your location, add books and find people you can exchange your
              books with.
            </Paragraph>
            <ButtonContainer>
              <TopButtons>
                <Button
                  onClick={handleLoginButtonClick}
                  asButtonTag
                  color="transparent"
                >
                  Log in
                </Button>
                <Link href="/signup" passHref>
                  <Button color="blue">Sign up</Button>
                </Link>
              </TopButtons>
              <Paragraph marginBelow={spaceSeven} fontSize="large">
                Or, to check available books in your area
              </Paragraph>
              <Button
                asButtonTag
                color="transparent"
                onClick={handleLocationButtonClick}
              >
                Select your location
              </Button>
            </ButtonContainer>
          </ContentWrapper>
        </PageCFAContainer>
        <PageImageContainer>
          <LandingImage />
        </PageImageContainer>
      </PageMain>
    </Container>
  );
};
