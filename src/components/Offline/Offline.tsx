import { Container, Wrapper, LogoWrapper, SignalWrapper } from './Offline.styles';
import { Signaal } from 'assets/Signal';
import { Logo } from 'assets/Logo';
import { Header } from 'ui-kits/Header';

export const Offline = () => {
  return (
    <Container>
      <Wrapper>
        <LogoWrapper>
          <Logo lightBG width={120} />
        </LogoWrapper>
        <SignalWrapper>
          <Signaal />
        </SignalWrapper>
        <Header headerFontSize={20}>
          Seems like you are offline! Connect to the internet.
        </Header>
      </Wrapper>
    </Container>
  );
};
