import {
  Container,
  Block,
  LogoWrapper,
  Sides,
  Image,
  ImageContainer,
  FlexBox,
} from './HowItWorks.styles';
import { Paragraph } from 'ui-kits/Paragraph';
import { Logo } from 'assets/Logo';
import { Header } from 'ui-kits/Header';

export const HowItWorks = () => {
  return (
    <Container>
      <LogoWrapper>
        <a href="/">
          <Logo width={120} />
        </a>
      </LogoWrapper>
      <Block backgroundSecondary>
        <Header headerFontSize={30}>How it works?</Header>
        <FlexBox>
          <Sides>
            <Paragraph>First sign up. Click on 'Select location' button.</Paragraph>
            <ImageContainer>
              <Image src={`/how-it/location.png`} alt="Location button image" />
            </ImageContainer>
          </Sides>
          <Sides>
            <Paragraph>A pop up will open. Select your location.</Paragraph>
            <ImageContainer>
              <Image src={`/how-it/map.png`} alt="Map image" />
            </ImageContainer>
          </Sides>
        </FlexBox>
      </Block>
      <Block>
        <FlexBox>
          <Sides bluBackground>
            <Paragraph>Click on 'Add a book' button on the top.</Paragraph>
            <Paragraph>A pop up will open.</Paragraph>
            <ImageContainer>
              <Image src={`/how-it/addabook.png`} alt="Add a book button image" />
            </ImageContainer>
          </Sides>
          <Sides bluBackground>
            <Paragraph>Add image of the book.</Paragraph>
            <Paragraph>Enter name of the book and author.</Paragraph>
            <ImageContainer>
              <Image src={`/how-it/addabookpopup.png`} />
            </ImageContainer>
          </Sides>
        </FlexBox>
      </Block>
      <Block backgroundSecondary>
        <FlexBox>
          <Sides>
            <Paragraph>
              Click on 'Show Interest' button on the books you are interested in.
            </Paragraph>
            <ImageContainer>
              <Image src={`/how-it/post.png`} alt="Add a book button image" />
            </ImageContainer>
          </Sides>
        </FlexBox>
      </Block>
      <Block>
        <FlexBox>
          <Sides bluBackground>
            <Paragraph>
              When someone is interested in your book you will get notified.
            </Paragraph>
            <Paragraph>For mutual interests, a chat button will appear.</Paragraph>
            <ImageContainer>
              <Image
                src={`/how-it/notification.png`}
                alt="Add a book button image"
              />
            </ImageContainer>
          </Sides>
          <Sides bluBackground>
            <Paragraph>
              Chat with the other person to fix a convenient time to swap books.
            </Paragraph>
            <ImageContainer>
              <Image src={`/how-it/message.png`} />
            </ImageContainer>
          </Sides>
        </FlexBox>
      </Block>
      <Block backgroundSecondary>
        <FlexBox>
          <Sides>
            <Paragraph>
              After books are swapped, click on the 'Matches' button on your post.
            </Paragraph>
            <ImageContainer>
              <Image src={`/how-it/post2.png`} alt="Location button image" />
            </ImageContainer>
          </Sides>
          <Sides>
            <Paragraph>Choose the book you received on the swap deal.</Paragraph>
            <ImageContainer>
              <Image src={`/how-it/matches.png`} alt="Map image" />
            </ImageContainer>
          </Sides>
        </FlexBox>
      </Block>
    </Container>
  );
};
