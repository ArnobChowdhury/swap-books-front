import React from 'react';
import {
  Wrapper,
  InterestedUserLink,
  IconWrapper,
  ActivityButton,
  LastModifiedStyled,
  Emphasis,
} from './NotificationChild.styles';
import { InterestNotificationIcon } from 'assets/InterestNotificationIcon';
import { SwapRequestNotification } from 'assets/SwapRequestNotification';
import { SwapAcceptNotification } from 'assets/SwapAcceptNotification';
import { SwapRejectNotification } from 'assets/SwapRejectNotification';
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
  onSwapApproval?: (hasAccepted: boolean) => void;
  swapConsentOnGoing?: NotificationShape['swapConsentOnGoing'];
  swapStatus?: NotificationShape['swapStatus'];
  swapConsentErr?: NotificationShape['swapConsentErr'];
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
  onSwapApproval,
  swapConsentOnGoing,
  swapStatus,
  swapConsentErr,
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
        {type === 'swapReq' && <SwapRequestNotification />}
        {type === 'swapApprove' && <SwapAcceptNotification />}
        {type === 'swapReject' && <SwapRejectNotification />}
      </IconWrapper>

      {type === 'interest' && (
        <span>
          <strong>Expressed Interest: </strong>
          {interestedUserName} is interested in your{' '}
          {bookNamesArePlural ? 'books' : 'book'} <Emphasis>{books}</Emphasis>. Check
          books you can swap with
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
          <Emphasis>{books}</Emphasis>. You are interested in {interestedUserName}
          &apos;s - <Emphasis>{ownersInterests}.</Emphasis>{' '}
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
          has claimed that you have swapped your book - <Emphasis>{books}</Emphasis>{' '}
          with {interestedUserName}'s book - <Emphasis>{ownersInterests}.</Emphasis>{' '}
          Do you accept this claim? <LastModified />
          {swapStatus === 'pending' && (
            <div>
              <ActivityButton
                noLeftMargin
                onClick={e => onSwapApproval && onSwapApproval(true)}
                className="dropdown-element"
                reqOnGoing={swapConsentOnGoing}
                disabled={swapConsentOnGoing}
              >
                Yes
              </ActivityButton>{' '}
              <ActivityButton
                isAlert
                onClick={e => onSwapApproval && onSwapApproval(false)}
                className="dropdown-element"
                reqOnGoing={swapConsentOnGoing}
                disabled={swapConsentOnGoing}
              >
                No
              </ActivityButton>
            </div>
          )}
          {swapStatus === 'approved' && (
            <div>
              <Emphasis>- Swap request accepted.</Emphasis>
            </div>
          )}
          {swapStatus === 'rejected' && (
            <div>
              <Emphasis>- Swap request rejected.</Emphasis>
            </div>
          )}
          {swapConsentErr && (
            <div>
              <Emphasis>{swapConsentErr.message}</Emphasis>
            </div>
          )}
        </span>
      )}
      {type === 'swapReject' && (
        <span>
          <strong>Swap Request Rejected: </strong>
          <Link href={`/user/${interestedUserId}`} passHref>
            <InterestedUserLink href={`/user/${interestedUserId}`}>
              {interestedUserName}
            </InterestedUserLink>
          </Link>{' '}
          has not accepted your swap request for book - <Emphasis>{books}</Emphasis>{' '}
          with {interestedUserName}'s book - <Emphasis>{ownersInterests}.</Emphasis>{' '}
          <LastModified />
        </span>
      )}
      {type === 'swapApprove' && (
        <span>
          <strong>Swap Request Accepted: </strong>
          <Link href={`/user/${interestedUserId}`} passHref>
            <InterestedUserLink href={`/user/${interestedUserId}`}>
              {interestedUserName}
            </InterestedUserLink>
          </Link>{' '}
          has accepted your swap request for book - <Emphasis>{books}</Emphasis> with{' '}
          {interestedUserName}'s book - <Emphasis>{ownersInterests}.</Emphasis>{' '}
          <LastModified />
        </span>
      )}
      {type === 'announcement' && <>{noticeText}</>}
    </Wrapper>
  );
};
