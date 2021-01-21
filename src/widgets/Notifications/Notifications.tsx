import { Wrapper } from './Notifications.styles';
import { NotificationShape } from 'redux/reducers/notifications';
import { NotificationChild } from 'components/NotificationChild';

export interface NotificationProps {
  notifications: NotificationShape[];
}

export const Notifications = ({ notifications }: NotificationProps): JSX.Element => {
  const notificationsChildren = notifications.map(
    ({
      fromId,
      notificationId,
      seen,
      bookName,
      fromName,
      noticeText,
      type,
      roomLink,
    }: NotificationShape) => (
      <NotificationChild
        key={notificationId}
        fromId={fromId}
        seen={seen}
        // bookNames={bookName}
        fromName={fromName}
        type={type}
        noticeText={noticeText}
        roomLink={roomLink}
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
