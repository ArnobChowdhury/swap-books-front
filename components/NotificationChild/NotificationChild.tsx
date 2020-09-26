import {
  Wrapper,
  InterestedUserLink,
  IconWrapper,
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
  matchLink?: string;
  otherProps?: HTMLAttributes<HTMLDivElement>;
}

export const NotificationChild: React.FC<NotificationChildProps> = ({
  seen,
  fromId: interestedUserId,
  fromName: interestedUserName,
  bookName,
  type,
  matchLink,
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

      {type === 'match' && matchLink && (
        <span>
          <strong>Time to Swap: </strong>
          {interestedUserName} is interested in your book {bookName}. Check books you
          can swap with
          <InterestedUserLink
            href={`${process.env.NEXT_PUBLIC_BASE_URL}${interestedUserId}`}
          >
            {` ${interestedUserName}.`}
          </InterestedUserLink>
        </span>
      )}

      {type === 'notice' && <>{noticeText}</>}
    </Wrapper>
  );
};
