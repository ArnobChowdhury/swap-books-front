import React, { useState } from 'react';
import GlobalStyles from '../components/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import { Landing } from '../components/Landing';
import { FlexContainer } from '../components/FlexContainer';
import { FlexItem } from '../components/FlexItem';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

// TODO
/**
 * Make the input boxes smaller in width (Maybe follow instagram's form login page)
 */
const Home = (): JSX.Element => {
  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  const closeModal = (): void => {
    showSignUpForm && setShowSignUpForm(false);
    showLoginForm && setShowLoginForm(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Landing
        loginOnClick={(): void => setShowLoginForm(!showLoginForm)}
        signupOnClick={(): void => setShowSignUpForm(!showSignUpForm)}
      />
      {showSignUpForm && (
        <Modal onClick={closeModal}>
          <FlexContainer direction="column" spacing={15}>
            <FlexItem>
              <Input
                type="email"
                labelText="Email:"
                value=""
                placeholder="Please type your email address"
                inputFieldFullWidth={true}
                isRequired={true}
                onChangeFunc={() => {}}
              />
            </FlexItem>
            <FlexItem>
              <Input
                type="password"
                labelText="Password"
                value=""
                placeholder="Choose a strong password"
                inputFieldFullWidth={true}
                isRequired={true}
                onChangeFunc={() => {}}
              />
            </FlexItem>
          </FlexContainer>
        </Modal>
      )}
    </ThemeProvider>
  );
};

export default Home;
