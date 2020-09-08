import { Wrapper } from './NotificationDropDown.styles';
import { NotificationShape } from 'redux/reducers/notifications';
import { NotificationChild } from 'components/NotificationChild';

export interface NotificationDropDownProps {
  notifications: NotificationShape[];
}

export const NotificationDropDown: React.FC<NotificationDropDownProps> = ({
  notifications,
}: NotificationDropDownProps): JSX.Element => {
  const notificationsChildren = notifications.map(
    ({
      fromId,
      notificationId,
      seen,
      bookName,
      fromName,
      noticeText,
      type,
      matchLink,
    }: NotificationShape) => (
      <NotificationChild
        key={notificationId}
        fromId={fromId}
        seen={seen}
        bookName={bookName}
        fromName={fromName}
        type={type}
        noticeText={noticeText}
        matchLink={matchLink}
      />
    ),
  );

  return (
    <Wrapper>
      {notifications.length > 0 && notificationsChildren}
      {notifications.length === 0 && (
        <div style={{ fontSize: '16px', padding: '10px' }}>
          No notifications at this moment.
        </div>
      )}
    </Wrapper>
  );
};
