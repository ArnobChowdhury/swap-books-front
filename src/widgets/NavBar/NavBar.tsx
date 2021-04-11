import { useRef, useEffect, useContext, useState } from 'react';
import { UserIcon } from 'ui-kits/UserIcon';
import {
  NavBarContainer,
  NavBarWrapper,
  NavButton,
  DropDown,
  Count,
} from './NavBar.styles';
import { Notifications } from 'widgets/Notifications';
import { Message } from 'widgets/Message';
import { UserNav } from 'widgets/UserNav';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { HomeIcon } from 'assets/HomeIcon';
import { ChatIcon } from 'assets/ChatIcon';
import { NotificationIcon } from 'assets/NotificationIcon';
import { RootState } from 'redux/reducers';
import { authLogout } from 'redux/actions/auth';
import { getNotificationsRequest } from 'redux/actions/notifications';
import { RootContext, RootContextProps, ContentType } from 'contexts/RootContext';
import { useWindowSize } from 'hooks/useWindowSize';
import { largeScreen } from 'mediaConfig';
import { useRouter } from 'next/router';
import {
  HOME_ROUTE,
  MESSAGES_ROUTE,
  NOTIFICATIONS_ROUTE,
  USER_ROUTE,
} from 'frontEndRoutes';
import { contentShouldOpenInThisPage } from 'utils';

// todo there should be not be any default arguments
export const NavBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const { name: userName } = useSelector((s: RootState) => s.user);
  const { userId } = useSelector((s: RootState) => s.auth);
  const { totalUnseen: totalUnseenNotification } = useSelector(
    (s: RootState) => s.notifications,
  );

  const { activeRooms } = useSelector((s: RootState) => s.message);
  const [totalUnseenMsgs, setTotalUnseenMsgs] = useState<number>(0);
  const router = useRouter();
  const { pathname, push: routerPush, asPath } = router;

  useEffect(() => {
    if (activeRooms) {
      let unseenMsgs = 0;
      activeRooms.forEach(room => {
        if (room.unreadMsgs) {
          unseenMsgs += 1;
        }
      });
      setTotalUnseenMsgs(unseenMsgs);
    }
  }, [activeRooms]);

  const { width } = useWindowSize();

  const rootContext = useContext(RootContext);
  const {
    contentType,
    setContentType,
    showDropDown,
    setShowDropDown,
  } = rootContext as RootContextProps;

  // refs
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const messageButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  // close modal on click outside the dropDown and on escape key anywhere
  useEffect(() => {
    if (width >= largeScreen) {
      const handleMouseClickOutsideDropDown = (e: MouseEvent) => {
        if (
          !dropDownRef.current?.contains(e.target as Node) &&
          !messageButtonRef.current?.contains(e.target as Node) &&
          !notificationButtonRef.current?.contains(e.target as Node) &&
          !userButtonRef.current?.contains(e.target as Node) &&
          !(e.target as HTMLElement).classList.contains('dropdown-element') &&
          contentType !== 'Posts'
        ) {
          switch (pathname) {
            case HOME_ROUTE:
              setContentType('Posts');
              break;
            case MESSAGES_ROUTE:
              setContentType('Messages');
              break;
            case NOTIFICATIONS_ROUTE:
              setContentType('Notifications');
              break;
            case USER_ROUTE:
              setContentType('User');
              break;
          }
          setShowDropDown(false);
        }
      };

      const handleEscKeyDownDropDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && contentType !== 'Posts') {
          setContentType('Posts');
        }
      };

      document.addEventListener('click', handleMouseClickOutsideDropDown);
      document.addEventListener('keydown', handleEscKeyDownDropDown);
      return () => {
        document.removeEventListener('click', handleMouseClickOutsideDropDown);
        document.removeEventListener('keydown', handleEscKeyDownDropDown);
      };
    }
  }, [contentType]);

  useEffect(() => {
    dispatch(getNotificationsRequest());
  }, []);

  const handleMsgButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'Messages') {
      if (width >= largeScreen) {
        if (pathname === HOME_ROUTE) {
          setContentType('Posts');
        } else if (pathname === NOTIFICATIONS_ROUTE) {
          setContentType('Notifications');
        } else if (pathname === USER_ROUTE) {
          setContentType('User');
        } else {
          routerPush(MESSAGES_ROUTE);
        }
      } else {
        routerPush(MESSAGES_ROUTE);
      }
      setShowDropDown(false);
    } else {
      setContentType('Messages');
      if (width >= largeScreen) {
        setShowDropDown(true);
      } else {
        routerPush(MESSAGES_ROUTE);
      }
    }
  };

  const handleNotificationButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'Notifications') {
      if (width >= largeScreen) {
        if (pathname === HOME_ROUTE) {
          setContentType('Posts');
        } else if (pathname === MESSAGES_ROUTE) {
          setContentType('Messages');
        } else if (pathname === USER_ROUTE) {
          setContentType('User');
        } else {
          routerPush(NOTIFICATIONS_ROUTE);
        }
      } else {
        routerPush(NOTIFICATIONS_ROUTE);
      }
      setShowDropDown(false);
    } else {
      setContentType('Notifications');
      if (width >= largeScreen) {
        setShowDropDown(true);
      } else {
        routerPush(NOTIFICATIONS_ROUTE);
      }
    }
  };

  const handleUserButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'User') {
      if (width >= largeScreen) {
        if (pathname === USER_ROUTE) {
          setShowDropDown(!showDropDown);
        } else {
          if (pathname === HOME_ROUTE) {
            setContentType('Posts');
          } else if (pathname === MESSAGES_ROUTE) {
            setContentType('Messages');
          } else if (pathname === NOTIFICATIONS_ROUTE) {
            setContentType('Notifications');
          }
          setShowDropDown(false);
        }
      } else {
        routerPush(asPath);
      }
    } else {
      setContentType('User');
      if (width >= largeScreen) {
        setShowDropDown(true);
      } else {
        routerPush(`/user/${userId}`);
      }
    }
  };

  const handleHomeButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    routerPush(HOME_ROUTE);
    setContentType('Posts');
    setShowDropDown(false);
  };

  return (
    <NavBarContainer ref={navigationRef}>
      {width >= largeScreen &&
        showDropDown &&
        contentShouldOpenInThisPage(pathname, contentType) && (
          <DropDown isSelected={contentType !== 'Posts'} ref={dropDownRef}>
            {contentType === 'Notifications' && <Notifications />}
            {contentType === 'Messages' && <Message />}
            {contentType === 'User' && (
              <UserNav onLogoutButtonClick={() => dispatch(authLogout())} />
            )}
          </DropDown>
        )}
      <NavBarWrapper>
        <NavButton
          borderBottom={contentType === 'Posts'}
          onClick={handleHomeButtonClick}
        >
          <HomeIcon hasBodyColor={contentType === 'Posts'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Messages'}
          onClick={handleMsgButtonClick}
          ref={messageButtonRef}
        >
          {totalUnseenMsgs > 0 && <Count>{totalUnseenMsgs}</Count>}
          <ChatIcon hasBodyColor={contentType === 'Messages'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Notifications'}
          onClick={handleNotificationButtonClick}
          ref={notificationButtonRef}
        >
          {totalUnseenNotification !== null && totalUnseenNotification > 0 && (
            <Count>{totalUnseenNotification}</Count>
          )}
          <NotificationIcon hasBodyColor={contentType === 'Notifications'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'User'}
          onClick={handleUserButtonClick}
          ref={userButtonRef}
        >
          <UserIcon
            hasBodyColor={contentType === 'User'}
            userName={userName ? userName : ''}
          />
        </NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
