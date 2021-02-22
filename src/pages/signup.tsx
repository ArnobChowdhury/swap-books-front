import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { SignupWidget } from 'widgets/SignupWidget';
import { RootContext, RootContextProps } from 'contexts/RootContext';

const UserDetails: NextPage = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { popupType, setPopupType } = rootContext as RootContextProps;

  useEffect(() => {
    if (popupType) {
      setPopupType(null);
    }
  }, []);

  return (
    <>
      <TopBar />
      <ModalManager />
      <SignupWidget />
    </>
  );
};

export default UserDetails;
