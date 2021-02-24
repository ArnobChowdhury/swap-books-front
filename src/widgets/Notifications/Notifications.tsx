import { useRef, useEffect, useContext } from 'react';
import { useOnScreen } from 'hooks';
import {
  Wrapper,
  NotificationLoaderContent,
  NotificationLoaderIcon,
  NotificationLoaderWrapper,
} from './Notifications.styles';
import { NotificationShape } from 'redux/reducers/notifications';
import { NotificationChild } from 'components/NotificationChild';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import {
  setNotificationAsSeenRequest,
  getNotificationsRequest,
} from 'redux/actions/notifications';
import { openMessageBox, setCurrentRoom } from 'redux/actions/message';
import { Header } from 'ui-kits/Header';
import theme from 'theme';
import { formatDistanceToNow } from 'date-fns';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { useRouter } from 'next/router';

export interface NotificationProps {
  notifications: NotificationShape[];
}

export const Notifications = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { contentType, setContentType } = rootContext as RootContextProps;
  const { notifications, hasMoreNotifications } = useSelector(
    (s: RootState) => s.notifications,
  );
  const { userId } = useSelector((s: RootState) => s.auth);
  const { activeRooms } = useSelector((s: RootState) => s.message);
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useRouter();
  const isNotificationsPage = pathname === '/notifications';

  const handleNotificationIsSeen = (roomId: string) => {
    dispatch(setNotificationAsSeenRequest(roomId));
  };

  const handleLoaderOnScreen = () => {
    if (userId && hasMoreNotifications) {
      dispatch(getNotificationsRequest(notifications.length));
    }
  };

  useOnScreen(loaderRef, wrapperRef, notifications, handleLoaderOnScreen, true);

  useEffect(() => {
    let intersectionObserver: IntersectionObserver;
    if (wrapperRef.current) {
      const nodes = document.querySelectorAll('div[data-roomid]');
      intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const roomId = (entry.target as HTMLElement).dataset.roomid;
              const notificationIndex = notifications.findIndex(
                notification => notification._id === roomId,
              );

              if (!notifications[notificationIndex].seen && roomId) {
                // @ts-ignore
                if (window.requestIdleCallback) {
                  // @ts-ignore
                  window.requestIdleCallback(() => handleNotificationIsSeen(roomId));
                } else {
                  handleNotificationIsSeen(roomId);
                }
              }

              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: wrapperRef.current,
        },
      );

      nodes.forEach(node => {
        intersectionObserver.observe(node);
      });
    }
    return () => {
      intersectionObserver.disconnect();
    };
  }, [notifications]);

  const handleChatButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    roomId: string,
  ) => {
    event.preventDefault();
    setContentType('Messages');
    dispatch(openMessageBox());
    const roomToOpen = activeRooms.find(room => room.roomId === roomId);
    if (roomToOpen) {
      dispatch(setCurrentRoom(roomToOpen));
    }
  };

  const notificationsChildren = notifications.map(
    ({
      _id,
      interestedUserId,
      interestedUserName,
      seen,
      notificationType,
      interestsOfThisUser,
      interestsOfInterestedUser,
      lastModified,
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
          onChatButtonClick={handleChatButtonClick}
          roomId={_id}
          lastModified={formatDistanceToNow(new Date(lastModified))}
        />
      );
    },
  );

  const { spaceThree } = theme;

  return (
    <Wrapper isNotificationsPage={isNotificationsPage} ref={wrapperRef}>
      <Header marginBelow={spaceThree}>Notifications</Header>
      {notifications.length > 0 && (
        <>
          {notificationsChildren}
          {hasMoreNotifications && (
            <NotificationLoaderWrapper ref={loaderRef}>
              <NotificationLoaderIcon className="gradient" />
              <NotificationLoaderContent className="gradient" />
            </NotificationLoaderWrapper>
          )}
        </>
      )}
      {notifications.length === 0 && (
        <div style={{ fontSize: '13px', padding: '10px 10px 10px 0px' }}>
          No notifications at this moment.
        </div>
      )}
    </Wrapper>
  );
};
