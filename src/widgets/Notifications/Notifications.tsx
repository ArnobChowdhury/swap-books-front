import { Wrapper } from './Notifications.styles';
import { NotificationShape } from 'redux/reducers/notifications';
import { NotificationChild } from 'components/NotificationChild';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

export interface NotificationProps {
  notifications: NotificationShape[];
}

export const Notifications = (): JSX.Element => {
  const { notifications } = useSelector((s: RootState) => s.notifications);

  const notificationsChildren = notifications.map(
    ({
      _id,
      interestedUserId,
      interestedUserName,
      seen,
      notificationType,
      interestsOfThisUser,
      interestsOfInterestedUser,
    }: NotificationShape) => {
      let ownersBookInterests;
      if (interestsOfThisUser) {
        ownersBookInterests = interestsOfThisUser.map(interests => {
          return interests.bookName;
        });
      }

      let interestsOfOtherUser;
      if (interestsOfInterestedUser) {
        interestsOfOtherUser = interestsOfInterestedUser.map(interests => {
          return interests.bookName;
        });
      }

      return (
        <NotificationChild
          key={_id}
          fromId={interestedUserId}
          bookNames={interestsOfOtherUser}
          seen={seen}
          fromName={interestedUserName}
          type={notificationType}
          ownersBookInterests={ownersBookInterests}
          // onChatButtonClick={}
          roomLink={_id}
        />
      );
    },
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
