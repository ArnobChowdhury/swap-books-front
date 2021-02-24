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
import Link from 'next/link';

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
  const { contentType, setContentType } = rootContext as RootContextProps;

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
            case '/':
              setContentType('Posts');
              break;
            case '/messages':
              setContentType('Messages');
              break;
            case '/notifications':
              console.log('This block got executed');
              setContentType('Notifications');
              break;
            case '/user/[id]':
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

  // TODO Consider moving this to context
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const handleMsgButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'Messages') {
      if (width >= largeScreen) {
        if (pathname === '/') {
          setContentType('Posts');
        } else if (pathname === '/notifications') {
          setContentType('Notifications');
        } else if (pathname === '/user/[id]') {
          setContentType('User');
        } else {
          routerPush('/messages');
        }
      } else {
        routerPush('/messages');
      }
      setShowDropDown(false);
    } else {
      setContentType('Messages');
      if (width >= largeScreen) {
        setShowDropDown(true);
      } else {
        routerPush('/messages');
      }
    }
  };

  const handleNotificationButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'Notifications') {
      if (width >= largeScreen) {
        if (pathname === '/') {
          setContentType('Posts');
        } else if (pathname === '/messages') {
          setContentType('Messages');
        } else if (pathname === '/user/[id]') {
          setContentType('User');
        } else {
          routerPush('/notifications');
        }
      } else {
        routerPush('/notifications');
      }
      setShowDropDown(false);
    } else {
      setContentType('Notifications');
      if (width >= largeScreen) {
        setShowDropDown(true);
      } else {
        routerPush('/notifications');
      }
    }
  };

  const handleUserButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (contentType === 'User') {
      if (width >= largeScreen) {
        if (pathname === '/user/[id]') {
          setShowDropDown(!showDropDown);
        } else {
          if (pathname === '/') {
            setContentType('Posts');
          } else if (pathname === '/messages') {
            setContentType('Messages');
          } else if (pathname === '/notifications') {
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
    routerPush('/');
    setContentType('Posts');
    setShowDropDown(false);
  };

  return (
    <NavBarContainer ref={navigationRef}>
      {width >= largeScreen && showDropDown && (
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
          buttonType="Posts"
          onClick={handleHomeButtonClick}
        >
          <HomeIcon hasBodyColor={contentType === 'Posts'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Messages'}
          onClick={handleMsgButtonClick}
          ref={messageButtonRef}
          buttonType="Messages"
        >
          {totalUnseenMsgs > 0 && (
            <Count buttonType="Messages">{totalUnseenMsgs}</Count>
          )}
          <ChatIcon hasBodyColor={contentType === 'Messages'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Notifications'}
          onClick={handleNotificationButtonClick}
          ref={notificationButtonRef}
          buttonType="Notifications"
        >
          {totalUnseenNotification !== null && totalUnseenNotification > 0 && (
            <Count buttonType="Notification">{totalUnseenNotification}</Count>
          )}
          <NotificationIcon hasBodyColor={contentType === 'Notifications'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'User'}
          buttonType="User"
          onClick={handleUserButtonClick}
          ref={userButtonRef}
        >
          <UserIcon userName={userName ? userName : ''} />
        </NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
