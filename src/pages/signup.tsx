import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ModalManager } from 'widgets/ModalManager';
import { SignupWidget } from 'widgets/SignupWidget';

const UserDetails: NextPage = (): JSX.Element => {
  return (
    <>
      <TopBar />
      <ModalManager />
      <SignupWidget />
    </>
  );
};

export default UserDetails;
