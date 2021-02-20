import {
  UserNavLink,
  UserNavLinkContainer,
  UserLogout,
  UserNavOptionWrapper,
} from './UserNav.styles';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

interface UserNavProps {
  onLogoutButtonClick: () => void;
}

export const UserNav = ({ onLogoutButtonClick }: UserNavProps) => {
  const { userId } = useSelector((s: RootState) => s.auth);

  return (
    <UserNavLinkContainer>
      <UserNavOptionWrapper>
        <UserNavLink href={`/user/${userId}`}>Your Profile</UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/how-to">How it Works</UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/about-us">About Us</UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/terms">Terms and Conditions</UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper marginTopAuto>
        <UserLogout onClick={onLogoutButtonClick}>Logout</UserLogout>
      </UserNavOptionWrapper>
    </UserNavLinkContainer>
  );
};
