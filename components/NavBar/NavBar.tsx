import { useState, useRef, useEffect } from 'react';
import {
  NavContainer,
  NavWrapper,
  NavUL,
  NavLinkWrapper,
  NavLinks,
  DropDown,
  ButtonWrapper,
} from './NavBar.styles';
import { NotificationDropDown } from 'components/NotificationDropDown';
import { Button } from 'components/Button';
import { Logo } from 'assets/Logo';
import { NotificationShape } from 'redux/reducers/notifications';

export interface NavBarProps {
  userName: string | null;
  isSignedIn: boolean;
  currentSelected?: 'Home' | 'Messages' | 'Notifications' | 'User';
  notifications: NotificationShape[];
  logoutFunc: () => void;
}

// todo there should be not be any default arguments
export const NavBar = ({
  isSignedIn,
  userName,
  currentSelected,
  notifications,
  logoutFunc,
}: NavBarProps): JSX.Element => {
  const [dropDown, setDropDown] = useState<
    'Messages' | 'Notifications' | 'User' | null
  >(null);

  const handleNotificationDropDown = () => {
    if (dropDown === 'Notifications') {
      setDropDown(null);
    } else {
      setDropDown('Notifications');
    }
  };

  // refs
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLLIElement | null>(null);

  // close modal on click outside the dropDown and on escape key anywhere
  useEffect(() => {
    const handleMouseClickOutsideDropDown = (e: MouseEvent) => {
      if (
        !dropDownRef.current?.contains(e.target as Node) &&
        !notificationRef.current?.contains(e.target as Node) &&
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

  return (
    <NavContainer>
      <DropDown isSelected={Boolean(dropDown)} ref={dropDownRef}>
        <NotificationDropDown notifications={notifications} />
      </DropDown>
      <NavWrapper>
        <div>
          <Logo />
        </div>
        {isSignedIn && (
          <NavUL>
            <NavLinkWrapper isSelected={currentSelected === 'Home'}>
              <NavLinks href="/" isSelected={currentSelected === 'Home'}>
                Books
              </NavLinks>
            </NavLinkWrapper>
            <NavLinkWrapper
              isSelected={currentSelected === 'Notifications'}
              onClick={handleNotificationDropDown}
              ref={notificationRef}
            >
              <NavLinks href="#" isSelected={currentSelected === 'Notifications'}>
                Notifications
              </NavLinks>
            </NavLinkWrapper>
            <NavLinkWrapper isSelected={currentSelected === 'User'}>
              <NavLinks href="/user" isSelected={currentSelected === 'User'}>
                {userName}
              </NavLinks>
            </NavLinkWrapper>
          </NavUL>
        )}
        {!isSignedIn && (
          <ButtonWrapper>
            <Button asButtonTag color="white">
              Log in
            </Button>
            <Button asButtonTag color="pink">
              Sign up
            </Button>
          </ButtonWrapper>
        )}
      </NavWrapper>
    </NavContainer>
  );
};
