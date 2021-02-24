import {
  UserNavLink,
  UserNavLinkContainer,
  UserLogout,
  UserNavOptionWrapper,
} from './UserNav.styles';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import Link from 'next/link';

interface UserNavProps {
  onLogoutButtonClick: () => void;
}

export const UserNav = ({ onLogoutButtonClick }: UserNavProps) => {
  const { userId } = useSelector((s: RootState) => s.auth);

  return (
    <UserNavLinkContainer>
      <UserNavOptionWrapper>
        <Link href={`/user/${userId}`} passHref>
          <UserNavLink className="dropdown-element">Your Profile</UserNavLink>
        </Link>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/how-to" className="dropdown-element">
          How it Works
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/about-us" className="dropdown-element">
          About Us
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/terms" className="dropdown-element">
          Terms and Conditions
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper marginTopAuto>
        <UserLogout onClick={onLogoutButtonClick}>Logout</UserLogout>
      </UserNavOptionWrapper>
    </UserNavLinkContainer>
  );
};
