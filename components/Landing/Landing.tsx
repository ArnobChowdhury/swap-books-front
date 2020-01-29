import {
  ContainerMain,
  CopyDiv,
  LogoDiv,
  ButtonDiv,
  BookDiv,
} from './Landing.styles';
import Book from './BookSVG';
import Logo from '../../assets/Logo';
import Button from '../Button';
import FlexContainer from '../FlexContainer';
import FlexItem from '../FlexItem';

interface LandingProps {
  loginOnClick: () => void;
  signupOnClick: () => void;
}

// const Landing: React.FC<LandingProps> = ({
//   loginOnClick,
//   signupOnClick,
// }: LandingProps): JSX.Element => {
//   return (
//     <ContainerMain>
//       <FlexContainer
//         direction="column"
//         height="100%"
//         justify="stretch"
//         alignItems="center"
//       >
//         {/* <FlexItem defaultSize={20}> */}
//         <LogoDiv>
//           <FlexContainer justify="center" height="170px" alignContent="flex-end">
//             <Logo width={450} />
//           </FlexContainer>
//         </LogoDiv>
//         <FlexItem width="60%">
//           <CopyDiv>
//             <header>
//               Swap <span>books</span> with people <span>nearby</span>
//             </header>
//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel neque
//               eget. nisi tincidunt gravida ac vitae ante. Duis euismod consectetur
//               viverra. Aenean vel arcu eget odio varius hendrerit ac et metus. Ut ut
//               sapien eu metus maximus maximus. Donec euismod.
//             </p>
//           </CopyDiv>
//         </FlexItem>
//         <ButtonDiv>
//           <FlexContainer justify="space-evenly">
//             <Button title="Sign up" isYellow onClick={signupOnClick} />
//             <Button title="Log in" onClick={loginOnClick} />
//           </FlexContainer>
//         </ButtonDiv>
//         <BookDiv>
//           <FlexContainer height="100%">
//             <FlexItem defaultSize={100}>
//               <Book />
//             </FlexItem>
//           </FlexContainer>
//         </BookDiv>
//       </FlexContainer>
//     </ContainerMain>
//   );
// };
const Landing: React.FC<LandingProps> = ({
  loginOnClick,
  signupOnClick,
}: LandingProps): JSX.Element => {
  return (
    <ContainerMain>
      <FlexContainer justify="center">
        <FlexItem defaultSize={40}>
          <FlexContainer justify="center">
            <LogoDiv>
              <Logo width={450} />
            </LogoDiv>
            <CopyDiv>
              <header>Swap books with people nearby</header>
              <p>
                We can never buy enough books. So just share it with the people that
                happen to live close to you. Or, maybe you would like to swap the
                book that you do not need anymore, swap it with a academic peer.
              </p>
            </CopyDiv>
            <ButtonDiv>
              <Button title="Sign up" isYellow onClick={signupOnClick} />
              <Button title="Log in" onClick={loginOnClick} />
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
export default Landing;
