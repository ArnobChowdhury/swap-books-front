import React from 'react';
import {
  Wrapper,
  InterestedUserLink,
  IconWrapper,
  ActivityButton,
  LastModifiedStyled,
  Books,
} from './NotificationChild.styles';
import { InterestNotificationIcon } from 'assets/InterestNotificationIcon';
import { SwapNotification } from 'assets/SwapNotification';
import { MatchIcon } from 'assets/MatchIcon';
import { HTMLAttributes } from 'react';
import Link from 'next/link';
import { NotificationShape } from 'redux/reducers/notifications';

export interface NotificationChildProps {
  seen: boolean;
  fromId: string;
  fromName: string;
  bookNames?: string[];
  ownersBookInterests?: string[];
  type: NotificationShape['notificationType'];
  noticeText?: string;
  otherProps?: HTMLAttributes<HTMLDivElement>;
  onChatButtonClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    roomId: string,
  ) => void;
  notificationId: string;
  lastModified: string;
  chatRoomId?: string;
}

export const NotificationChild = ({
  seen,
  fromId: interestedUserId,
  fromName: interestedUserName,
  bookNames,
  ownersBookInterests,
  type,
  noticeText,
  otherProps,
  onChatButtonClick,
  notificationId,
  lastModified,
  chatRoomId,
}: NotificationChildProps): JSX.Element => {
  const bookNamesArePlural = bookNames && bookNames.length > 1;

  let books;
  if (bookNames) {
    books = bookNames.length > 1 ? bookNames.join(', ') : bookNames[0];
  }

  const ownersInterests = ownersBookInterests?.join(', ');

  const LastModified = React.useCallback(() => {
    return <LastModifiedStyled> &#8210; {lastModified}</LastModifiedStyled>;
  }, [lastModified]);

  return (
    <Wrapper seen={seen} {...otherProps} data-nid={notificationId}>
      <IconWrapper>
        {type === 'interest' && <InterestNotificationIcon />}
        {type === 'match' && <MatchIcon />}
        {type === 'swapReq' && <SwapNotification />}
      </IconWrapper>

      {type === 'interest' && (
        <span>
          <strong>Expressed Interest: </strong>
          {interestedUserName} is interested in your{' '}
          {bookNamesArePlural ? 'books' : 'book'} <Books>{books}</Books>. Check books
          you can swap with
          <Link href={`/user/${interestedUserId}`} passHref>
            <InterestedUserLink>{` ${interestedUserName}.`}</InterestedUserLink>
          </Link>{' '}
          <LastModified />
        </span>
      )}

      {type === 'match' && (
        <span>
          <strong>Time to Swap: </strong>
          <Link href={`/user/${interestedUserId}`} passHref>
            <InterestedUserLink href={`/user/${interestedUserId}`}>
              {interestedUserName}
            </InterestedUserLink>
          </Link>{' '}
          is interested in your {bookNamesArePlural ? 'books' : 'book'}{' '}
          <Books>{books}</Books>. You are interested in {interestedUserName}&apos;s -{' '}
          <Books>{ownersInterests}.</Books>{' '}
          <ActivityButton
            onClick={e =>
              onChatButtonClick && onChatButtonClick(e, chatRoomId as string)
            }
            className="dropdown-element"
          >
            Chat
          </ActivityButton>{' '}
          with him to make a swap deal. <LastModified />
        </span>
      )}

      {type === 'swapReq' && (
        <span>
          <strong>Swap Claim: </strong>
          <Link href={`/user/${interestedUserId}`} passHref>
            <InterestedUserLink href={`/user/${interestedUserId}`}>
              {interestedUserName}
            </InterestedUserLink>
          </Link>{' '}
          has claimed that you have swapped your book - <Books>{books}</Books> with{' '}
          {interestedUserName}'s book - <Books>{ownersInterests}.</Books> Do you
          accept this claim?{' '}
          <ActivityButton
            onClick={e =>
              onChatButtonClick && onChatButtonClick(e, chatRoomId as string)
            }
            className="dropdown-element"
          >
            Yes
          </ActivityButton>{' '}
          <ActivityButton
            isAlert
            onClick={e =>
              onChatButtonClick && onChatButtonClick(e, chatRoomId as string)
            }
            className="dropdown-element"
          >
            No
          </ActivityButton>{' '}
          <LastModified />
        </span>
      )}
      {type === 'announcement' && <>{noticeText}</>}
    </Wrapper>
  );
};
