import { BookDiv, ContainerMain, LogoDiv, CopyDiv } from './Landing.styles';
import Book from './BookSVG';
import Logo from '../../assets/Logo';
import Button from '../Button';
import FlexContainer from '../FlexContainer';
import FlexItem from '../FlexItem';

interface LandingProps {
  loginOnClick: () => void;
  signupOnClick: () => void;
}

const Landing: React.FC<LandingProps> = ({
  loginOnClick,
  signupOnClick,
}: LandingProps): JSX.Element => {
  return (
    <ContainerMain>
      <LogoDiv>
        <Logo width={450} />
      </LogoDiv>
      <CopyDiv>
        <header>
          Swap <span>books</span> with people <span>nearby</span>
        </header>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel neque eget
          nisi tincidunt gravida ac vitae ante. Duis euismod consectetur viverra.
          Aenean vel arcu eget odio varius hendrerit ac et metus. Ut ut sapien eu
          metus maximus maximus. Donec euismod.
        </p>
      </CopyDiv>
      <FlexContainer justify="center">
        <FlexItem defaultSize={12}>
          <FlexContainer justify="space-between">
            <Button title="Sign up" isYellow onClick={signupOnClick} />
            <Button title="Log in" onClick={loginOnClick} />
          </FlexContainer>
        </FlexItem>
      </FlexContainer>

      <BookDiv>
        <Book />
      </BookDiv>
    </ContainerMain>
  );
};

export default Landing;
