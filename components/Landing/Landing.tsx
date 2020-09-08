import {
  ContainerMain,
  CopyDiv,
  LogoDiv,
  ButtonDiv,
  BookDiv,
} from './Landing.styles';
import Book from './BookSVG';
import { Logo } from '../../assets/Logo';
import { Button } from '../Button';
import { FlexContainer } from '../FlexContainer';
import { FlexItem } from '../FlexItem';

interface LandingProps {
  loginOnClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  loginOnClick,
}: LandingProps): JSX.Element => {
  return (
    <ContainerMain>
      <FlexContainer justify="center">
        <FlexItem defaultSize={80} sm={60} lg={40}>
          <FlexContainer justify="center">
            <LogoDiv>
              <Logo width={450} />
            </LogoDiv>
            <CopyDiv>
              <header>Swap books with people nearby</header>
              <p>
                We can never buy enough books. So just share it with the people that
                happen to live close to you. Or, maybe you would like to swap the
                book that you do not need anymore.
              </p>
            </CopyDiv>
            <ButtonDiv>
              <Button color="yellow" href="/signup">
                Sign up
              </Button>
              <Button color="transparent" onClick={loginOnClick}>
                Log in
              </Button>
            </ButtonDiv>
            <BookDiv>
              <Book />
            </BookDiv>
          </FlexContainer>
        </FlexItem>
      </FlexContainer>
    </ContainerMain>
  );
};
