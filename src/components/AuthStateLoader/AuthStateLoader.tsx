import { Container, Wrapper } from './AuthStateLoader.styles';
import { Logo } from 'assets/Logo';
import { LoaderBook } from 'assets/LoaderBook';

export const AuthStateLoader = () => {
  return (
    <Container>
      <Wrapper>
        <Logo width={300} />
        <LoaderBook />
      </Wrapper>
    </Container>
  );
};
