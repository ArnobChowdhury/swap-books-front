import { useState, useRef, useEffect } from 'react';
import {
  NavBarContainer,
  NavBarWrapper,
  NavButton,
  DropDown,
  UserIcon,
  Count,
} from './NavBar.styles';
import { Notifications } from 'widgets/Notifications';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
// import { RootState } from 'redux/reducers';
import { HomeIcon } from 'assets/HomeIcon';
import { ChatIcon } from 'assets/ChatIcon';
import { NotificationIcon } from 'assets/NotificationIcon';
import { RootState } from 'redux/reducers';
import { authLogout } from 'redux/actions/auth';
import { getNotificationsRequest } from 'redux/actions/notifications';
import { getUserInitials } from 'utils/index';

// todo there should be not be any default arguments
export const NavBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const userName = useSelector((s: RootState) => s.user.name);
  const { totalUnseen } = useSelector((s: RootState) => s.notifications);

  let userInitials;
  if (userName) {
    userInitials = getUserInitials(userName as string);
  }

  const [dropDown, setDropDown] = useState<
    'Messages' | 'Notifications' | 'User' | null
  >(null);

  // refs
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const messageButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  // close modal on click outside the dropDown and on escape key anywhere
  useEffect(() => {
    const handleMouseClickOutsideDropDown = (e: MouseEvent) => {
      if (
        !dropDownRef.current?.contains(e.target as Node) &&
        !messageButtonRef.current?.contains(e.target as Node) &&
        !notificationButtonRef.current?.contains(e.target as Node) &&
        dropDown !== null
      ) {
        setDropDown(null);
      }
    };

    const handleEscKeyDownDropDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropDown !== null) {
        setDropDown(null);
      }
    };

    document.addEventListener('click', handleMouseClickOutsideDropDown);
    document.addEventListener('keydown', handleEscKeyDownDropDown);
    return () => {
      document.removeEventListener('click', handleMouseClickOutsideDropDown);
      document.removeEventListener('keydown', handleEscKeyDownDropDown);
    };
  }, [dropDown]);

  useEffect(() => {
    dispatch(getNotificationsRequest());
  }, []);

  const handleNavButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    button: 'Messages' | 'Notifications' | 'User' | null,
  ) => {
    event.preventDefault();
    if (dropDown === button) {
      setDropDown(null);
    } else {
      setDropDown(button);
    }
  };

  return (
    <NavBarContainer ref={navigationRef}>
      <DropDown isSelected={Boolean(dropDown)} ref={dropDownRef}>
        {dropDown === 'Notifications' && <Notifications />}
      </DropDown>
      <NavBarWrapper>
        <NavButton borderBottom={false} buttonType="Home">
          <HomeIcon hasBodyColor={true} />
        </NavButton>
        <NavButton
          borderBottom={dropDown === 'Messages'}
          onClick={e => {
            handleNavButtonClick(e, 'Messages');
          }}
          ref={messageButtonRef}
          buttonType="Messages"
        >
          <ChatIcon hasBodyColor={dropDown === 'Messages'} />
        </NavButton>
        <NavButton
          borderBottom={dropDown === 'Notifications'}
          onClick={e => handleNavButtonClick(e, 'Notifications')}
          ref={notificationButtonRef}
          buttonType="Notifications"
        >
          {totalUnseen !== null && totalUnseen > 0 && (
            <Count buttonType="Notification">{totalUnseen}</Count>
          )}
          <NotificationIcon hasBodyColor={dropDown === 'Notifications'} />
        </NavButton>
        <NavButton
          borderBottom={dropDown === 'User'}
          buttonType="User"
          onClick={() => {
            dispatch(authLogout());
          }}
        >
          <UserIcon>{userInitials}</UserIcon>
        </NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
