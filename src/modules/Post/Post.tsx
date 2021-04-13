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
  ValidTillTime,
} from './Post.styles';
import { InterestIcon } from 'assets/InterestIcon';
import { EditIcon } from 'assets/EditIcon';
import { TenDaysValidityIcon } from 'assets/TenDaysValidityIcon';
import { IconButton } from 'ui-kits/IconButton';
import { UserIcon } from 'ui-kits/UserIcon';
import { PostOption, PostOptionProps } from 'components/PostOption';
import { BookNameIcon } from 'assets/BookNameIcon';
import { BookAuthorIcon } from 'assets/BookAuthorIcon';
import { CloseIcon } from 'assets/CloseIcon';
import { PostButtonSmall } from 'components/PostButtonSmall';
import { useWindowSize } from 'hooks/useWindowSize';
import { formatDistanceToNow } from 'date-fns';

export interface PostProps {
  imgUrl: string;
  bookName: string;
  bookAuthor: string;
  bookOwnerName: string;
  isInterested: boolean;
  topMargin?: boolean;
  reqOnGoing: boolean;
  onInterestButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onUnavailableButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isOwners: boolean;
  isUsersProfile: boolean;
  validTill: string;
  onEditButtonClick?: () => void;
  onAvailableButtonClick?: () => void;
  availableTenMoreDaysReqOnGoing?: boolean;
  availableTenMoreDaysSuccessMsg?: string | null;
  availableTenMoreDaysErr?: { message: string; status: number } | null;
}

export const Post = ({
  imgUrl,
  bookName,
  bookAuthor,
  bookOwnerName,
  topMargin,
  reqOnGoing,
  isInterested = false,
  onInterestButtonClick,
  onUnavailableButtonClick,
  isOwners,
  isUsersProfile,
  validTill,
  onEditButtonClick,
  onAvailableButtonClick,
  availableTenMoreDaysReqOnGoing,
  availableTenMoreDaysSuccessMsg,
  availableTenMoreDaysErr,
}: PostProps): JSX.Element => {
  const { width } = useWindowSize();

  const postOwnersOptions: PostOptionProps['options'] = [
    { name: 'Edit', iconComponent: <EditIcon />, onClick: onEditButtonClick },
    {
      name: 'Mark Available for 10 days',
      iconComponent: <TenDaysValidityIcon />,
      onClick: onAvailableButtonClick,
    },
  ];

  return (
    <PostWrapper requestOnGoing={reqOnGoing} topMargin={topMargin}>
      <PostOwner>
        <UserIcon userName={bookOwnerName} hasRightMargin />
        {bookOwnerName}
      </PostOwner>
      <ImageWrapper>
        <ValidTillTime>{formatDistanceToNow(new Date(validTill))}</ValidTillTime>
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
        {!isUsersProfile && width >= 450 && (
          <IconButton
            buttonText={isInterested ? 'Interested' : 'Show Interest'}
            icon={
              <InterestIcon hasBodyColor={isInterested} width="30" height="30" />
            }
            onClick={onInterestButtonClick}
            disabled={isOwners}
            requestOngoing={reqOnGoing}
            textColor="primary"
          />
        )}
        {!isUsersProfile && width < 450 && (
          <PostButtonSmall
            onClick={onInterestButtonClick}
            requestOnGoing={reqOnGoing}
            disabled={isOwners}
            icon={
              <InterestIcon
                lightBorder
                hasBodyColor={isInterested}
                width="40"
                height="40"
              />
            }
          />
        )}
        {isUsersProfile && width >= 450 && (
          <IconButton
            buttonText="Unavailable"
            icon={<CloseIcon colorAlert width="25" height="25" />}
            onClick={onUnavailableButtonClick}
            requestOngoing={reqOnGoing}
            textColor="primary"
          />
        )}
        {isUsersProfile && width < 450 && (
          <PostButtonSmall
            onClick={onUnavailableButtonClick}
            requestOnGoing={reqOnGoing}
            icon={<CloseIcon colorAlert width="35" height="35" />}
          />
        )}
      </PostBottom>
      {isOwners && (
        <PostOptionWrapper>
          <PostOption
            options={postOwnersOptions}
            availableTenMoreDaysErr={availableTenMoreDaysErr}
            availableTenMoreDaysSuccessMsg={availableTenMoreDaysSuccessMsg}
            availableTenMoreDaysReqOnGoing={availableTenMoreDaysReqOnGoing}
          />
        </PostOptionWrapper>
      )}
    </PostWrapper>
  );
};
