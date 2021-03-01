import { MouseEvent } from 'react';
import {
  PostWrapper,
  ImageWrapper,
  Image,
  ContentWrapper,
  ContentContainer,
  BookInfo,
  PostBottom,
  PostOptionWrapper,
  PostOwner,
} from './Post.styles';
import { InterestIcon } from 'assets/InterestIcon';
import { IconButton } from 'ui-kits/IconButton';
import { UserIcon } from 'ui-kits/UserIcon';
import { PostOption, PostOptionProps } from 'components/PostOption';
import { BookNameIcon } from 'assets/BookNameIcon';
import { BookAuthorIcon } from 'assets/BookAuthorIcon';
import { InterestButtonSmall } from 'components/InterestButtonSmall';
import { useWindowSize } from 'hooks/useWindowSize';

export interface PostProps {
  imgUrl: string;
  bookName: string;
  bookAuthor: string;
  bookOwnerName: string;
  isInterested: boolean;
  topMargin?: boolean;
  interestReqOnGoing: boolean;
  onInterestButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isOwners: boolean;
  postOptions?: PostOptionProps['options'];
}

export const Post = ({
  imgUrl,
  bookName,
  bookAuthor,
  bookOwnerName,
  topMargin,
  interestReqOnGoing,
  isInterested = false,
  onInterestButtonClick,
  isOwners,
  postOptions,
}: PostProps): JSX.Element => {
  const { width } = useWindowSize();
  return (
    <PostWrapper topMargin={topMargin}>
      <PostOwner>
        <UserIcon userName={bookOwnerName} hasRightMargin />
        {bookOwnerName}
      </PostOwner>
      <ImageWrapper>
        <Image src={imgUrl} alt={`image of book named: ${bookName}`} />
      </ImageWrapper>
      <PostBottom>
        <ContentWrapper>
          <ContentContainer>
            <BookNameIcon />
            <BookInfo isBookName>{bookName}</BookInfo>
          </ContentContainer>
          <ContentContainer>
            <BookAuthorIcon />
            <BookInfo>{bookAuthor}</BookInfo>
          </ContentContainer>
        </ContentWrapper>
        {width >= 450 && (
          <IconButton
            buttonText={isInterested ? 'Interested' : 'Show Interest'}
            icon={
              <InterestIcon hasBodyColor={isInterested} width="30" height="30" />
            }
            onClick={onInterestButtonClick}
            disabled={isOwners}
            requestOngoing={interestReqOnGoing}
            textColor="primary"
          />
        )}
        {width < 450 && (
          <InterestButtonSmall
            onClick={onInterestButtonClick}
            isSelected={isInterested}
            requestOnGoing={interestReqOnGoing}
            disabled={isOwners}
          />
        )}
      </PostBottom>
      {/**Todo: Post option should be changed later */}
      {postOptions && (
        <PostOptionWrapper>
          <PostOption options={postOptions} />
        </PostOptionWrapper>
      )}
    </PostWrapper>
  );
};
