import {
  // useState,
  // useRef,
  // useEffect,
  useContext,
  // Dispatch,
  // SetStateAction,
} from 'react';
import { TopBarContainer, TopBarWrapper, ButtonWrapper } from './TopBar.styles';
// import { NotificationDropDown } from 'widgets/NotificationDropDown';
import { Button } from 'ui-kits/Button';
import { Logo } from 'assets/Logo';
// import { NotificationShape } from 'redux/reducers/notifications';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { NavBar } from 'widgets/NavBar';

// todo there should be not be any default arguments
export const TopBar = (): JSX.Element => {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  // refs
  // const dropDownRef = useRef<HTMLDivElement | null>(null);
  // const notificationRef = useRef<HTMLLIElement | null>(null);

  // // close modal on click outside the dropDown and on escape key anywhere
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

  const rootContext = useContext(RootContext);
  const { setPopupType, setShowModal } = rootContext as RootContextProps;

  const handleLoginButtonClick = () => {
    setShowModal(true);
    setPopupType('login');
  };

  const handleSignupButtonClick = () => {
    setShowModal(true);
    setPopupType('signup');
  };
  return (
    <TopBarContainer>
      <TopBarWrapper>
        <div>
          <Logo />
        </div>
        {isSignedIn && <NavBar />}
        {!isSignedIn && (
          <ButtonWrapper>
            <Button onClick={handleLoginButtonClick} asButtonTag color="white">
              Log in
            </Button>
            <Button onClick={handleSignupButtonClick} asButtonTag color="pink">
              Sign up
            </Button>
          </ButtonWrapper>
        )}
      </TopBarWrapper>
    </TopBarContainer>
  );
};
