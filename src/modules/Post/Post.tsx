import { MouseEvent, useState } from 'react';
import {
  PostWrapper,
  ImageWrapper,
  Image,
  ImagePlaceholder,
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
import { DeleteIcon } from 'assets/DeleteIcon';
import { TenDaysValidityIcon } from 'assets/TenDaysValidityIcon';
import { IconButton } from 'ui-kits/IconButton';
import { UserIcon } from 'ui-kits/UserIcon';
import { PostOption, PostOptionProps } from 'components/PostOption';
import { BookNameIcon } from 'assets/BookNameIcon';
import { BookAuthorIcon } from 'assets/BookAuthorIcon';
import { CloseIcon } from 'assets/CloseIcon';
import { SwapIcon } from 'assets/SwapIcon';
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
  onPostButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isOwners: boolean;
  validTill: string;
  onEditButtonClick?: () => void;
  onAvailableButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
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
  onPostButtonClick,
  isOwners,
  validTill,
  onEditButtonClick,
  onAvailableButtonClick,
  onDeleteButtonClick,
  availableTenMoreDaysReqOnGoing,
  availableTenMoreDaysSuccessMsg,
  availableTenMoreDaysErr,
}: PostProps): JSX.Element => {
  const { width } = useWindowSize();

  const postOwnersOptions: PostOptionProps['options'] = [
    { name: 'Edit', iconComponent: <EditIcon />, onClick: onEditButtonClick },
    {
      name: 'Mark available for 10 days',
      iconComponent: <TenDaysValidityIcon />,
      onClick: onAvailableButtonClick,
    },
    {
      name: 'Delete post',
      iconComponent: <DeleteIcon />,
      onClick: onDeleteButtonClick,
    },
  ];

  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const handleMainImgLoad = () => {
    setMainImgLoaded(true);
  };

  return (
    <PostWrapper requestOnGoing={reqOnGoing} topMargin={topMargin}>
      <PostOwner>
        <UserIcon userName={bookOwnerName} hasRightMargin />
        {bookOwnerName}
      </PostOwner>
      <ImageWrapper>
        <ValidTillTime>{formatDistanceToNow(new Date(validTill))}</ValidTillTime>
        <Image
          src={imgUrl}
          alt={`image of book named: ${bookName}`}
          onLoad={handleMainImgLoad}
          onError={handleMainImgLoad}
          mainImgLoaded={mainImgLoaded}
        />
        <ImagePlaceholder
          src={`${imgUrl}?w=100&h=100&f=jpg`}
          alt={`image of book named: ${bookName}`}
          mainImgLoaded={mainImgLoaded}
        />
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
        {!isOwners && width >= 450 && (
          <IconButton
            buttonText={isInterested ? 'Interested' : 'Show Interest'}
            icon={
              <InterestIcon hasBodyColor={isInterested} width="32" height="32" />
            }
            onClick={onPostButtonClick}
            disabled={isOwners}
            requestOngoing={reqOnGoing}
            textColor="primary"
          />
        )}
        {isOwners && width >= 450 && (
          <IconButton
            buttonText={'Matches'}
            icon={<SwapIcon />}
            onClick={onPostButtonClick}
            requestOngoing={reqOnGoing}
            textColor="primary"
          />
        )}
        {!isOwners && width < 450 && (
          <PostButtonSmall
            onClick={onPostButtonClick}
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
        {isOwners && width <= 450 && (
          <PostButtonSmall
            onClick={onPostButtonClick}
            requestOnGoing={reqOnGoing}
            icon={<SwapIcon />}
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
