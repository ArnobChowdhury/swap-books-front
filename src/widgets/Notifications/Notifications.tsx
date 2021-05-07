import { useRef, useEffect, useContext } from 'react';
import { useOnScreen, useWindowSize } from 'hooks';
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
  swapConsentRequest,
} from 'redux/actions/notifications';
import { openMessageBox, setCurrentRoom } from 'redux/actions/message';
import { Header } from 'ui-kits/Header';
import theme from 'theme';
import { formatDistanceToNow } from 'date-fns';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { useRouter } from 'next/router';
import { NOTIFICATIONS_ROUTE } from 'frontEndRoutes';
import { largeScreen } from 'mediaConfig';
import { MESSAGES_ROUTE } from 'frontEndRoutes';
import { SocketIoContext } from 'hoc/Sockets';
export interface NotificationProps {
  notifications: NotificationShape[];
}

export const Notifications = (): JSX.Element => {
  const { width } = useWindowSize();
  const rootContext = useContext(RootContext);
  const {
    contentType,
    setContentType,
    setShowDropDown,
  } = rootContext as RootContextProps;
  const { notifications, hasMoreNotifications } = useSelector(
    (s: RootState) => s.notifications,
  );
  const { userId } = useSelector((s: RootState) => s.auth);
  const { activeRooms } = useSelector((s: RootState) => s.message);
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { pathname, push: routerPush } = useRouter();
  const isNotificationsPage = pathname === NOTIFICATIONS_ROUTE;

  const handleNotificationIsSeen = (notificationId: string) => {
    dispatch(setNotificationAsSeenRequest(notificationId));
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
      const nodes = document.querySelectorAll('div[data-nid]');
      intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const nId = (entry.target as HTMLElement).dataset.nid;
              const notificationIndex = notifications.findIndex(
                notification => notification._id === nId,
              );

              if (!notifications[notificationIndex].seen && nId) {
                // @ts-ignore
                if (window.requestIdleCallback) {
                  // @ts-ignore
                  window.requestIdleCallback(() => handleNotificationIsSeen(nId));
                } else {
                  handleNotificationIsSeen(nId);
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
    setShowDropDown(true);
    dispatch(openMessageBox());
    const roomToOpen = activeRooms.find(room => room.roomId === roomId);
    if (roomToOpen) {
      dispatch(setCurrentRoom(roomToOpen));
      if (width < largeScreen) {
        routerPush(MESSAGES_ROUTE);
      }
    }
  };

  const { socketIo } = useContext(SocketIoContext);

  const notificationsChildren = notifications.map(
    ({
      _id,
      notificationFromId,
      notificationFromName,
      seen,
      notificationType,
      usersBookInterests,
      notificationForBooks,
      lastModified,
      chatRoomId,
      swapConsentErr,
      swapConsentOnGoing,
      swapStatus,
    }: NotificationShape) => {
      let ownersBookInterests;
      if (usersBookInterests) {
        ownersBookInterests = usersBookInterests.map(interests => {
          return interests.bookName;
        });
      }

      let interestsOfOtherUser;
      if (notificationForBooks) {
        interestsOfOtherUser = notificationForBooks.map(interests => {
          return interests.bookName;
        });
      }

      const handleSwapApproval = (hasAccepted: boolean) => {
        if (socketIo)
          dispatch(
            swapConsentRequest(
              socketIo,
              _id,
              notificationForBooks ? notificationForBooks[0].bookId : '',
              hasAccepted,
            ),
          );
      };

      return (
        <NotificationChild
          key={_id}
          fromId={notificationFromId}
          bookNames={interestsOfOtherUser}
          seen={seen}
          fromName={notificationFromName}
          type={notificationType}
          ownersBookInterests={ownersBookInterests}
          onChatButtonClick={handleChatButtonClick}
          notificationId={_id}
          lastModified={formatDistanceToNow(new Date(lastModified))}
          chatRoomId={chatRoomId}
          onSwapApproval={
            notificationType === 'swapReq' ? handleSwapApproval : undefined
          }
          swapConsentErr={swapConsentErr}
          swapConsentOnGoing={swapConsentOnGoing}
          swapStatus={swapStatus}
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
