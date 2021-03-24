import { useContext } from 'react';
import { Paragraph } from 'ui-kits/Paragraph';
import { Button } from 'ui-kits/Button';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { ButtonWrapper } from './NeedAuth.styles';
import Link from 'next/link';

export const NeedAuth = (): JSX.Element => {
  const { setPopupType } = useContext(RootContext) as RootContextProps;

  const handleLoginButtonClick = () => {
    setPopupType('login');
  };

  return (
    <>
      <Paragraph fontSize="large" centerAlign fontWeight="regular">
        You need to Sign up or Log in to add a book or to show interest to swap a
        book.
      </Paragraph>
      <ButtonWrapper>
        <Button onClick={handleLoginButtonClick} asButtonTag color="white">
          Log in
        </Button>
        <Link href="/signup" passHref>
          <Button color="blue">Sign up</Button>
        </Link>
      </ButtonWrapper>
    </>
  );
};
