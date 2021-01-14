import {
  Wrapper,
  InterestedUserLink,
  IconWrapper,
  ChatButton,
} from './NotificationChild.styles';
import { InterestIcon } from 'assets/InterestIcon';
import { AgreementIcon } from 'assets/AgreementIcon';
import { HTMLAttributes } from 'react';

export interface NotificationChildProps {
  seen: boolean;
  fromId: string;
  fromName: string;
  bookName?: string;
  type: 'interest' | 'match' | 'notice';
  noticeText?: string;
  roomLink?: string;
  otherProps?: HTMLAttributes<HTMLDivElement>;
}

export const NotificationChild: React.FC<NotificationChildProps> = ({
  seen,
  fromId: interestedUserId,
  fromName: interestedUserName,
  bookName,
  type,
  roomLink,
  noticeText,
  otherProps,
}: NotificationChildProps): JSX.Element => {
  return (
    <Wrapper seen={seen} {...otherProps}>
      <IconWrapper>
        {type === 'interest' && (
          <InterestIcon hasBodyColor width="25px" height="25px" />
        )}
        {type === 'match' && <AgreementIcon width="45px" height="38px" />}
      </IconWrapper>

      {type === 'interest' && (
        <span>
          <strong>Expressed Interest: </strong>
          {interestedUserName} is interested in your book {bookName}. Check books you
          can swap with
          <InterestedUserLink href={`/user/${interestedUserId}`}>
            {` ${interestedUserName}.`}
          </InterestedUserLink>
        </span>
      )}

      {type === 'match' && roomLink && (
        <span>
          <strong>Time to Swap: </strong>
          {interestedUserName} is interested in your book {bookName}. Check other
          books you can swap with
          <InterestedUserLink href={`/user/${interestedUserId}`}>
            {` ${interestedUserName}.`}
          </InterestedUserLink>{' '}
          Or <ChatButton>chat</ChatButton> with him to make a deal.
        </span>
      )}

      {type === 'notice' && <>{noticeText}</>}
    </Wrapper>
  );
};
