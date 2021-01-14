// import { useState, useRef, useEffect } from 'react';
import {
  NavBarContainer,
  NavBarWrapper,
  NavButton,
  // DropDown,
} from './NavBar.styles';
// import { NotificationDropDown } from 'widgets/NotificationDropDown';
// import { useSelector } from 'react-redux';
// import { RootState } from 'redux/reducers';

// todo there should be not be any default arguments
export const NavBar = (): JSX.Element => {
  // const { notifications } = useSelector((s: RootState) => s.notifications);
  // const [dropDown, setDropDown] = useState<
  //   'Messages' | 'Notifications' | 'User' | null
  // >(null);

  // const handleNotificationDropDown = () => {
  //   if (dropDown === 'Notifications') {
  //     setDropDown(null);
  //   } else {
  //     setDropDown('Notifications');
  //   }
  // };

  // refs
  // const dropDownRef = useRef<HTMLDivElement | null>(null);
  // const notificationRef = useRef<HTMLLIElement | null>(null);

  // close modal on click outside the dropDown and on escape key anywhere
  // useEffect(() => {
  //   const handleMouseClickOutsideDropDown = (e: MouseEvent) => {
  //     if (
  //       !dropDownRef.current?.contains(e.target as Node) &&
  //       !notificationRef.current?.contains(e.target as Node) &&
  //       dropDown !== null
  //     ) {
  //       setDropDown(null);
  //     }
  //   };

  //   const handleEscKeyDownDropDown = (e: KeyboardEvent) => {
  //     if (e.key === 'Escape' && dropDown !== null) {
  //       setDropDown(null);
  //     }
  //   };

  //   document.addEventListener('click', handleMouseClickOutsideDropDown);
  //   document.addEventListener('keydown', handleEscKeyDownDropDown);
  //   return () => {
  //     document.removeEventListener('click', handleMouseClickOutsideDropDown);
  //     document.removeEventListener('keydown', handleEscKeyDownDropDown);
  //   };
  // }, [dropDown]);

  return (
    <NavBarContainer>
      {/* <DropDown isSelected={Boolean(dropDown)} ref={dropDownRef}>
        <NotificationDropDown notifications={notifications} />
      </DropDown> */}
      <NavBarWrapper>
        <NavButton>Books</NavButton>
        <NavButton>Notifications</NavButton>
        <NavButton>A name coorect it</NavButton>
      </NavBarWrapper>
    </NavBarContainer>
  );
};
