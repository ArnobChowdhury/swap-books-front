import { useRef, useEffect, useContext } from 'react';
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

// todo there should be not be any default arguments
export const NavBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const userName = useSelector((s: RootState) => s.user.name);
  const { totalUnseen } = useSelector((s: RootState) => s.notifications);

  const { width } = useWindowSize();

  const rootContext = useContext(RootContext);
  const { contentType, setContentType } = rootContext as RootContextProps;

  // refs
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const messageButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  // close modal on click outside the dropDown and on escape key anywhere
  useEffect(() => {
    if (width >= largeScreen) {
      const handleMouseClickOutsideDropDown = (e: MouseEvent) => {
        if (
          !dropDownRef.current?.contains(e.target as Node) &&
          !messageButtonRef.current?.contains(e.target as Node) &&
          !notificationButtonRef.current?.contains(e.target as Node) &&
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
        </DropDown>
      )}
      <NavBarWrapper>
        <NavButton
          borderBottom={contentType === 'Posts'}
          buttonType="Posts"
          onClick={e => handleNavButtonClick(e, 'Posts')}
        >
          <HomeIcon hasBodyColor={contentType === 'Posts'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Messages'}
          onClick={e => {
            handleNavButtonClick(e, 'Messages');
          }}
          ref={messageButtonRef}
          buttonType="Messages"
        >
          <ChatIcon hasBodyColor={contentType === 'Messages'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'Notifications'}
          onClick={e => handleNavButtonClick(e, 'Notifications')}
          ref={notificationButtonRef}
          buttonType="Notifications"
        >
          {totalUnseen !== null && totalUnseen > 0 && (
            <Count buttonType="Notification">{totalUnseen}</Count>
          )}
          <NotificationIcon hasBodyColor={contentType === 'Notifications'} />
        </NavButton>
        <NavButton
          borderBottom={contentType === 'User'}
          buttonType="User"
          onClick={() => {
            dispatch(authLogout());
          }}
        >
          <UserIcon userName={userName ? userName : ''} />
        </NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
