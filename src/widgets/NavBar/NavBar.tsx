import { useRef, useEffect, useContext, useState } from 'react';
import { UserIcon } from 'ui-kits/UserIcon';
import {
  NavBarContainer,
  NavBarWrapper,
  NavButton,
  NavButtonAsATag,
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
  const userName = useSelector((s: RootState) => s.user.name);
  const { totalUnseen: totalUnseenNotification } = useSelector(
    (s: RootState) => s.notifications,
  );

  const { activeRooms } = useSelector((s: RootState) => s.message);
  const [totalUnseenMsgs, setTotalUnseenMsgs] = useState<number>(0);
  const router = useRouter();

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
          !(e.target as HTMLElement).classList.contains('chat-button') &&
          contentType !== 'Posts'
        ) {
          setContentType('Posts');
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

  const handleNavButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: ContentType,
  ) => {
    event.preventDefault();
    if (contentType === button) {
      setContentType('Posts');
    } else {
      setContentType(button);
    }
  };

  return (
    <NavBarContainer ref={navigationRef}>
      {width >= largeScreen && (
        <DropDown isSelected={contentType !== 'Posts'} ref={dropDownRef}>
          {contentType === 'Notifications' && <Notifications />}
          {contentType === 'Messages' && <Message />}
          {contentType === 'User' && (
            <UserNav onLogoutButtonClick={() => dispatch(authLogout())} />
          )}
        </DropDown>
      )}
      <NavBarWrapper>
        <Link href="/" passHref>
          <NavButtonAsATag borderBottom={contentType === 'Posts'} buttonType="Posts">
            <HomeIcon hasBodyColor={contentType === 'Posts'} />
          </NavButtonAsATag>
        </Link>
        <NavButton
          borderBottom={contentType === 'Messages'}
          onClick={e => {
            handleNavButtonClick(e, 'Messages');
          }}
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
          onClick={e => handleNavButtonClick(e, 'Notifications')}
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
          onClick={e => handleNavButtonClick(e, 'User')}
          ref={userButtonRef}
        >
          <UserIcon userName={userName ? userName : ''} />
        </NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
