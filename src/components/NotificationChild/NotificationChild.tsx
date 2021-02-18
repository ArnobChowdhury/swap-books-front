import React from 'react';
import {
  Wrapper,
  InterestedUserLink,
  IconWrapper,
  ChatButton,
  LastModifiedStyled,
} from './NotificationChild.styles';
import { InterestNotificationIcon } from 'assets/InterestNotificationIcon';
import { MatchIcon } from 'assets/MatchIcon';
import { HTMLAttributes } from 'react';

export interface NotificationChildProps {
  seen: boolean;
  fromId: string;
  fromName: string;
  bookNames?: string[];
  ownersBookInterests?: string[];
  type: 'interest' | 'match' | 'notice';
  noticeText?: string;
  otherProps?: HTMLAttributes<HTMLDivElement>;
  onChatButtonClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    roomId: string,
  ) => void;
  roomId: string;
  lastModified: string;
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
  roomId,
  lastModified,
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
    <Wrapper seen={seen} {...otherProps} data-roomid={roomId}>
      <IconWrapper>
        {type === 'interest' && <InterestNotificationIcon />}
        {type === 'match' && <MatchIcon />}
      </IconWrapper>

      {type === 'interest' && (
        <span>
          <strong>Expressed Interest: </strong>
          {interestedUserName} is interested in your{' '}
          {bookNamesArePlural ? 'books' : 'book'} <i>{books}</i>. Check books you can
          swap with
          <InterestedUserLink href={`/user/${interestedUserId}`}>
            {` ${interestedUserName}.`}
          </InterestedUserLink>{' '}
          <LastModified />
        </span>
      )}

      {type === 'match' && (
        <span>
          <strong>Time to Swap: </strong>
          <InterestedUserLink href={`/user/${interestedUserId}`}>
            {interestedUserName}
          </InterestedUserLink>{' '}
          is interested in your {bookNamesArePlural ? 'books' : 'book'}{' '}
          <i>{books}</i>. You are interested in {interestedUserName}&apos;s -{' '}
          <i>{ownersInterests}.</i>{' '}
          <ChatButton
            onClick={e => onChatButtonClick && onChatButtonClick(e, roomId)}
            className="chat-button"
          >
            Chat
          </ChatButton>{' '}
          with him to make a swap deal. <LastModified />
        </span>
      )}

      {type === 'notice' && <>{noticeText}</>}
    </Wrapper>
  );
};
