import { MouseEvent } from 'react';
import {
  PostWrapper,
  ImageWrapper,
  Image,
  ContentWrapper,
  ContentContainer,
  ContentLeft,
  ContentRight,
  InterestIconWrapper,
  InterestButton,
} from './Post.styles';
import { InterestIcon } from 'assets/InterestIcon';

interface PostProps {
  imgUrl: string;
  bookName: string;
  bookAuthor: string;
  edition?: string;
  genre?: string;
  availableIn?: string;
  isInterested: boolean;
  bottomMargin?: boolean;
  interestButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
  key: number;
}

export const Post = ({
  imgUrl,
  bookName,
  bookAuthor,
  edition,
  genre,
  availableIn,
  bottomMargin,
  isInterested = false,
  interestButtonClick,
}: PostProps): JSX.Element => {
  return (
    <PostWrapper bottomMargin={bottomMargin}>
      <ImageWrapper>
        <Image src={imgUrl} />
      </ImageWrapper>
      <ContentContainer>
        <ContentWrapper>
          <ContentLeft>Book:</ContentLeft>
          <ContentRight isTitle>{bookName}</ContentRight>
        </ContentWrapper>
        <ContentWrapper>
          <ContentLeft>Author:</ContentLeft>
          <ContentRight>{bookAuthor}</ContentRight>
        </ContentWrapper>
        <ContentWrapper>
          <ContentLeft>Genre:</ContentLeft>
          <ContentRight>{genre}</ContentRight>
        </ContentWrapper>
        <ContentWrapper>
          <ContentLeft>Available in:</ContentLeft>
          <ContentRight>{availableIn}</ContentRight>
        </ContentWrapper>
      </ContentContainer>
      <InterestIconWrapper>
        <InterestButton onClick={interestButtonClick}>
          <InterestIcon hasBodyColor={isInterested} />
          I&apos;m Interested
        </InterestButton>
      </InterestIconWrapper>
    </PostWrapper>
  );
};
