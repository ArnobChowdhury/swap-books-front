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
  userName: string;
  currentSelected?: 'Books' | 'Messages' | 'Notifications' | 'User' | 'Logout';
}

// todo there should be not be any default arguments
export const NavBar = ({
  userName = 'User',
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
          <NavLinkWrapper
            isSelected={currentSelected === 'Logout'}
            onClick={() => dispatch(authLogout())}
          >
            <NavLinks href="#" isSelected={currentSelected === 'Logout'}>
              Logout
            </NavLinks>
          </NavLinkWrapper>
        </NavUL>
      </NavWrapper>
    </NavContainer>
  );
};
