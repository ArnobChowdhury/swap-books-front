import {
  NavContainer,
  NavWrapper,
  NavUL,
  NavLinkWrapper,
  NavLinks,
} from './NavBar.styles';
import Logo from 'assets/Logo';
import { useDispatch } from 'react-redux';
import { authLogout } from 'redux/actions/auth';

interface NavBarProps {
  userName: string | null;
  isSignedIn: boolean;
  currentSelected?: 'Books' | 'Messages' | 'Notifications' | 'User' | 'Auth';
}

// todo there should be not be any default arguments
export const NavBar = ({
  isSignedIn,
  userName,
  currentSelected,
}: NavBarProps): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <NavContainer>
      <NavWrapper>
        <div>
          <Logo width={185} />
        </div>
        <NavUL>
          <NavLinkWrapper isSelected={currentSelected === 'Books'}>
            <NavLinks href="#" isSelected={currentSelected === 'Books'}>
              Books
            </NavLinks>
          </NavLinkWrapper>
          {isSignedIn && (
            <>
              <NavLinkWrapper isSelected={currentSelected === 'Messages'}>
                <NavLinks href="#" isSelected={currentSelected === 'Messages'}>
                  Messages
                </NavLinks>
              </NavLinkWrapper>
              <NavLinkWrapper isSelected={currentSelected === 'Notifications'}>
                <NavLinks href="#" isSelected={currentSelected === 'Notifications'}>
                  Notifications
                </NavLinks>
              </NavLinkWrapper>
              <NavLinkWrapper isSelected={currentSelected === 'User'}>
                <NavLinks href="#" isSelected={currentSelected === 'User'}>
                  {userName}
                </NavLinks>
              </NavLinkWrapper>
            </>
          )}
          <NavLinkWrapper
            isSelected={currentSelected === 'Auth'}
            onClick={() => {
              isSignedIn
                ? dispatch(authLogout())
                : () => {
                    /**Login modal will appear */
                  };
            }}
          >
            <NavLinks href="#" isSelected={currentSelected === 'Auth'}>
              {isSignedIn ? 'Logout' : 'Login'}
            </NavLinks>
          </NavLinkWrapper>
        </NavUL>
      </NavWrapper>
    </NavContainer>
  );
};
