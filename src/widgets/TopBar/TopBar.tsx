import { useContext, ReactNode } from 'react';
import {
  TopBarContainer,
  TopBarWrapper,
  ButtonWrapper,
  ItemWrapper,
} from './TopBar.styles';
import { Button } from 'ui-kits/Button';
import { Logo } from 'assets/Logo';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import Link from 'next/link';

// todo there should be not be any default arguments
export interface TopBarProps {
  activityBar?: ReactNode;
  navBar?: ReactNode;
}

export const TopBar = ({ activityBar, navBar }: TopBarProps): JSX.Element => {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  const rootContext = useContext(RootContext);
  const { setPopupType, setShowModal } = rootContext as RootContextProps;

  const handleLoginButtonClick = () => {
    setShowModal(true);
    setPopupType('login');
  };

  return (
    <TopBarContainer>
      <TopBarWrapper isSignedIn={isSignedIn}>
        <ItemWrapper itemAlign="left">
          <Link href="/" passHref>
            <a>
              <Logo lightBG width={120} />
            </a>
          </Link>
        </ItemWrapper>
        {activityBar && <ItemWrapper itemAlign="center">{activityBar}</ItemWrapper>}
        {isSignedIn && navBar && (
          <ItemWrapper itemAlign="right">{navBar}</ItemWrapper>
        )}
        {!isSignedIn && (
          <ItemWrapper itemAlign="right">
            <ButtonWrapper>
              <Button onClick={handleLoginButtonClick} asButtonTag color="white">
                Log in
              </Button>
              <Link href="/signup" passHref>
                <Button color="blue">Sign up</Button>
              </Link>
            </ButtonWrapper>
          </ItemWrapper>
        )}
      </TopBarWrapper>
    </TopBarContainer>
  );
};
