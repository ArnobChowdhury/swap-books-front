import {
  Container,
  Block,
  LogoWrapper,
  Image,
  ImageContainer,
  DevImageContainer,
  FlexBox,
  MidContainer,
  DevImage,
  LogoContainer,
  PackageContainer,
} from './About.styles';
import { Paragraph } from 'ui-kits/Paragraph';
import { Logo } from 'assets/Logo';
import { Header } from 'ui-kits/Header';

export const About = () => {
  return (
    <Container>
      <LogoWrapper>
        <a href="/">
          <Logo width={120} />
        </a>
      </LogoWrapper>
      <Block background="white">
        <FlexBox>
          <MidContainer>
            <Header>A little about how it came to be...</Header>
          </MidContainer>
        </FlexBox>
      </Block>
      <Block background="white">
        <FlexBox>
          <MidContainer>
            <DevImageContainer>
              <DevImage src="/how-it/dev.jpg" />
            </DevImageContainer>
            <Paragraph fontSize="large" fontWeight="regular">
              Hi, my name is Arnob. I am a web developer from Bangladesh. Let me tell
              you the story behind Pustokio. I went to a bookshop one day and bought
              a few books. While walking back home, I realized I am broke, and with
              no hope of getting a job anytime soon I will not be able to buy new
              books. So, I was thinking to myself &#8212; it would have been nice if
              I could exchange these books with other books when I am done reading
              these. But, I never heard of a service that lets you exchange books.
              So, I decided to make Pustokio &#8212; a location based book swapping
              app. I know what you are thinking right now - wouldn't going to a
              library be easier? Maybe yes. But I am a web developer, I build web
              apps.
            </Paragraph>
          </MidContainer>
        </FlexBox>
      </Block>
      <Block background="white">
        <FlexBox>
          <MidContainer>
            <Header>
              Awesome free and open source technologies Pustokio built with and
              indebted to
            </Header>
          </MidContainer>
        </FlexBox>
      </Block>
      <Block background="white">
        <FlexBox>
          <MidContainer>
            <LogoContainer>
              <PackageContainer href="https://nodejs.org" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/nodejs.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  NodeJS
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://expressjs.com/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/expressjs.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  ExpressJS
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://reactjs.org" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/reactjs.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  ReactJS
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://nextjs.org" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/nextjs.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  NextJS
                </Paragraph>
              </PackageContainer>
              <PackageContainer
                href="https://styled-components.com/"
                target="_blank"
              >
                <ImageContainer>
                  <Image src="/how-it/styledcomponents.png" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Styled components
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://react-redux.js.org/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/redux.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  React-Redux
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://nextjs.org" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/mongodb.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  MongoDB
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://socket.io" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/socketio.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Socket.io
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://jwt.io" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/jwt.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  JWT
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://redis.io/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/redis.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Redis
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://date-fns.org/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/date-fns.svg" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Date-fns
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://nodemailer.com/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/nodemailer.png" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Nodemailer
                </Paragraph>
              </PackageContainer>
              <PackageContainer
                href="https://sharp.pixelplumbing.com/"
                target="_blank"
              >
                <ImageContainer>
                  <Image src="/how-it/sharp.png" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Sharp
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://formik.org/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/formik.png" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  Formik
                </Paragraph>
              </PackageContainer>
              <PackageContainer href="https://nsfwjs.com/" target="_blank">
                <ImageContainer>
                  <Image src="/how-it/nsfwjs.png" />
                </ImageContainer>
                <Paragraph fontSize="large" fontWeight="regular">
                  NSFWJS
                </Paragraph>
              </PackageContainer>
            </LogoContainer>
          </MidContainer>
        </FlexBox>
      </Block>
      <Block background="white">
        <FlexBox>
          <Paragraph fontSize="large" fontWeight="regular">
            And many more! It is not even possible to name all.
          </Paragraph>
        </FlexBox>
      </Block>
    </Container>
  );
};
