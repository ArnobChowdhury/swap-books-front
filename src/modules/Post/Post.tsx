import { MouseEvent } from 'react';
import {
  PostWrapper,
  ImageWrapper,
  Image,
  ContentWrapper,
  ContentContainer,
  InterestIconWrapper,
  PostOptionWrapper,
  PostOwner,
  PostOwnerImg,
} from './Post.styles';
import { InterestIcon } from 'assets/InterestIcon';
import { IconButton } from 'ui-kits/IconButton';
import { PostOption, PostOptionProps } from 'components/PostOption';
import { getUserInitials } from 'utils/getUserInitials';

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
  return (
    <>
      <PostWrapper topMargin={topMargin}>
        <PostOwner>
          <PostOwnerImg>{getUserInitials(bookOwnerName)}</PostOwnerImg>
          {bookOwnerName}
        </PostOwner>
        <ImageWrapper>
          <Image src={imgUrl} alt={`image of book named: ${bookName}`} />
          <ContentWrapper>
            <ContentContainer isBookName>{bookName}</ContentContainer>
            <ContentContainer>{bookAuthor}</ContentContainer>
          </ContentWrapper>
        </ImageWrapper>
        <InterestIconWrapper>
          <IconButton
            buttonText={isInterested ? 'Interested' : 'Show Interest'}
            icon={
              <InterestIcon hasBodyColor={isInterested} width="30" height="30" />
            }
            onClick={onInterestButtonClick}
            disabled={interestReqOnGoing || isOwners}
            requestOngoing={interestReqOnGoing}
            textColor="primary"
          />
        </InterestIconWrapper>
        {/**Todo: Post option should be changed later */}
        {postOptions && (
          <PostOptionWrapper>
            <PostOption options={postOptions} />
          </PostOptionWrapper>
        )}
      </PostWrapper>
    </>
  );
};
