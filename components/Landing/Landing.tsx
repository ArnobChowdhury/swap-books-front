import { BookDiv, ContainerDiv } from './Landing.styles';
import Icon from './BookSVG';

const Landing: React.FC = (): JSX.Element => {
  return (
    <ContainerDiv>
      <BookDiv>
        <Icon />
      </BookDiv>
    </ContainerDiv>
  );
};

export default Landing;
