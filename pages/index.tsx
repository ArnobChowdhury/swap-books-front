import React, { useState } from 'react';
import GlobalStyles from '../components/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import { Landing } from '../components/Landing';
import { FlexContainer } from '../components/FlexContainer';
import { FlexItem } from '../components/FlexItem';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// TODO
/**
 * 1. Make the input boxes smaller in width (Maybe follow instagram's form login page). Plnr: on hold: 1
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
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Required'),
                password: Yup.string()
                  .required('Password needed')
                  .min(8, 'Too short. Needs to have min. 8 characters')
                  .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              <Form>
                <FlexItem>
                  <Input
                    type="email"
                    labelText="Email:"
                    name="email"
                    value=""
                    placeholder="Please type your email address"
                    isRequired={true}
                    onChangeFunc={() => {}}
                  />
                </FlexItem>
                <FlexItem>
                  <Input
                    type="password"
                    labelText="Password"
                    name="password"
                    value=""
                    placeholder="Choose a strong password"
                    isRequired={true}
                    onChangeFunc={() => {}}
                  />
                </FlexItem>
              </Form>
            </Formik>
          </FlexContainer>
        </Modal>
      )}
    </ThemeProvider>
  );
};

export default Home;
