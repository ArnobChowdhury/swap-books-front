import {
  // useState,
  // useRef,
  // useEffect,
  useContext,
  ReactNode,
  // Dispatch,
  // SetStateAction,
} from 'react';
import {
  TopBarContainer,
  TopBarWrapper,
  ButtonWrapper,
  ItemWrapper,
} from './TopBar.styles';
// import { NotificationDropDown } from 'widgets/NotificationDropDown';
import { Button } from 'ui-kits/Button';
import { Logo } from 'assets/Logo';
// import { NotificationShape } from 'redux/reducers/notifications';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { NavBar } from 'widgets/NavBar';
import { Modal } from 'ui-kits/Modal';
import { Login, LoginCredentials } from 'modules/Login';
import { useDispatch } from 'react-redux';
import { authRequest } from 'redux/actions/auth';
import { FormikHelpers } from 'formik';

// todo there should be not be any default arguments
export interface TopBarProps {
  activityBar?: ReactNode;
}

export const TopBar = ({ activityBar }: TopBarProps): JSX.Element => {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);
  const dispatch = useDispatch();

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
  const {
    setPopupType,
    setShowModal,
    showModal,
    popupType,
  } = rootContext as RootContextProps;

  const handleLoginButtonClick = () => {
    setShowModal(true);
    setPopupType('login');
  };

  const handleSignupButtonClick = () => {
    setShowModal(true);
    setPopupType('signup');
  };

  const handleLoginSubmit = (
    { email, password }: LoginCredentials,
    { setSubmitting }: FormikHelpers<LoginCredentials>,
  ) => {
    dispatch(authRequest(email, password, setSubmitting, setShowModal));
  };

  return (
    <TopBarContainer>
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          {popupType === 'login' && <Login onSubmit={handleLoginSubmit} />}
        </Modal>
      )}
      <TopBarWrapper>
        <ItemWrapper itemAlign="left">
          <Logo />
        </ItemWrapper>
        {activityBar && <ItemWrapper itemAlign="center">{activityBar}</ItemWrapper>}
        {isSignedIn && (
          <ItemWrapper itemAlign="right">
            <NavBar />
          </ItemWrapper>
        )}
        {!isSignedIn && (
          <ItemWrapper itemAlign="right">
            <ButtonWrapper>
              <Button onClick={handleLoginButtonClick} asButtonTag color="white">
                Log in
              </Button>
              <Button onClick={handleSignupButtonClick} asButtonTag color="pink">
                Sign up
              </Button>
            </ButtonWrapper>
          </ItemWrapper>
        )}
      </TopBarWrapper>
    </TopBarContainer>
  );
};
