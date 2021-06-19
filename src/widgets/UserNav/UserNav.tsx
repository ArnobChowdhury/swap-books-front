import React, { useContext } from 'react';
import {
  UserNavLink,
  UserNavLinkContainer,
  UserLogout,
  UserNavOptionWrapper,
} from './UserNav.styles';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { useDispatch } from 'react-redux';
import { authLogout } from 'redux/actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RootContext, RootContextProps } from 'contexts/RootContext';

export const UserNav = () => {
  const { userId } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const { asPath } = useRouter();
  const usersProfileRoute = `/user/${userId}`;
  const rootContext = useContext(RootContext);
  const { setShowModal } = rootContext as RootContextProps;

  const handleAuthLogout = () => {
    dispatch(authLogout());
    setShowModal(false);
  };

  return (
    <UserNavLinkContainer>
      {asPath !== usersProfileRoute && (
        <UserNavOptionWrapper>
          <Link href={`/user/${userId}`} passHref>
            <UserNavLink className="dropdown-element">My Profile</UserNavLink>
          </Link>
        </UserNavOptionWrapper>
      )}
      <UserNavOptionWrapper>
        <UserNavLink href="/how-it-works" className="dropdown-element">
          How it Works
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/about" className="dropdown-element">
          About
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper>
        <UserNavLink href="/terms" className="dropdown-element">
          Terms and Conditions
        </UserNavLink>
      </UserNavOptionWrapper>
      <UserNavOptionWrapper marginTopAuto>
        <UserLogout onClick={handleAuthLogout}>Logout</UserLogout>
      </UserNavOptionWrapper>
    </UserNavLinkContainer>
  );
};
