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
  bookOwnerName: string;
  edition?: string;
  genre?: string;
  availableIn?: string;
  isInterested: boolean;
  bottomMargin?: boolean;
  interestReqOnGoing: boolean;
  interestButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  key: string;
  isOwners: boolean;
}

export const Post = ({
  imgUrl,
  bookName,
  bookAuthor,
  bookOwnerName,
  edition,
  genre,
  availableIn,
  bottomMargin,
  interestReqOnGoing,
  isInterested = false,
  interestButtonClick,
  isOwners,
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
        <ContentWrapper>
          <ContentLeft>Posted by:</ContentLeft>
          <ContentRight>{isOwners ? 'You' : bookOwnerName}</ContentRight>
        </ContentWrapper>
      </ContentContainer>
      {!isOwners && (
        <InterestIconWrapper>
          <InterestButton
            onClick={interestButtonClick}
            interestReqOnGoing={interestReqOnGoing}
            disabled={interestReqOnGoing}
          >
            <InterestIcon hasBodyColor={isInterested} width="20px" height="20px" />
            I&apos;m Interested
          </InterestButton>
        </InterestIconWrapper>
      )}
    </PostWrapper>
  );
};
