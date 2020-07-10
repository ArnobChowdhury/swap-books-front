import { NavWrapper, NavUL, NavLinkWrapper, NavLinks } from './NavBar.styles';
import Logo from 'assets/Logo';

interface NavBarProps {
  userName: string;
  currentSelected?: 'Books' | 'Messages' | 'Notifications' | 'User';
}

// todo there should be not be any default arguments
export const NavBar = ({
  userName = 'User',
  currentSelected,
}: NavBarProps): JSX.Element => {
  return (
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
      </NavUL>
    </NavWrapper>
  );
};
