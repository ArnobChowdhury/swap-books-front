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
  PostOptionWrapper,
} from './Post.styles';
import { InterestIcon } from 'assets/InterestIcon';
import { IconButton } from 'ui-kits/IconButton';
import { PostOption, PostOptionProps } from 'components/PostOption';

export interface PostProps {
  imgUrl: string;
  bookName: string;
  bookAuthor: string;
  bookOwnerName: string;
  isInterested: boolean;
  bottomMargin?: boolean;
  interestReqOnGoing: boolean;
  onInterestButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  key: string;
  isOwners: boolean;
  postOptions?: PostOptionProps['options'];
}

export const Post = ({
  imgUrl,
  bookName,
  bookAuthor,
  bookOwnerName,
  bottomMargin,
  interestReqOnGoing,
  isInterested = false,
  onInterestButtonClick,
  isOwners,
  postOptions,
}: PostProps): JSX.Element => {
  return (
    <PostWrapper bottomMargin={bottomMargin}>
      <ImageWrapper>
        <Image src={imgUrl} alt={`image of book named: ${bookName}`} />
      </ImageWrapper>
      <ContentContainer>
        <ContentWrapper>
          <ContentLeft>Book</ContentLeft>
          <ContentRight isTitle>{bookName}</ContentRight>
        </ContentWrapper>
        <ContentWrapper>
          <ContentLeft>Author</ContentLeft>
          <ContentRight>{bookAuthor}</ContentRight>
        </ContentWrapper>
        <ContentWrapper>
          <ContentLeft>Owner</ContentLeft>
          <ContentRight>{isOwners ? 'You' : bookOwnerName}</ContentRight>
        </ContentWrapper>
      </ContentContainer>
      {!isOwners && (
        <InterestIconWrapper>
          <IconButton
            buttonText={isInterested ? 'Interested' : 'Show Interest'}
            icon={
              <InterestIcon hasBodyColor={isInterested} width="25" height="25" />
            }
            onClick={onInterestButtonClick}
            disabled={interestReqOnGoing}
            textColor="secondary"
          />
        </InterestIconWrapper>
      )}
      {/**Todo: Post option should be changed later */}
      {postOptions && (
        <PostOptionWrapper>
          <PostOption options={postOptions} />
        </PostOptionWrapper>
      )}
    </PostWrapper>
  );
};
