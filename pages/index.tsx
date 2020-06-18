import React, { useState } from 'react';
import GlobalStyles from '../components/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';
import { Landing } from '../components/Landing';
import { FlexContainer } from '../components/FlexContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
// import fetch from 'node-fetch';

let client;
if (process.browser) {
  client = new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
    fetch: fetch,
  });
}

client
  ?.query({
    query: gql`
      {
        rates(currency: "USD") {
          currency
        }
      }
    `,
  })
  .then(result => console.log(result));

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
        <Modal onClick={closeModal} modalContentPadding="4rem 5rem 4rem 3rem">
          <div>
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
                  console.log('submit happened');
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              <Form>
                <Input
                  type="email"
                  labelText="Email:"
                  name="email"
                  value=""
                  placeholder="Please type your email address"
                  isRequired={true}
                  onChangeFunc={() => {}}
                  inputFieldFullWidth={true}
                  labelMinWidth="10rem"
                  marginBottom="1rem"
                />
                <Input
                  type="password"
                  labelText="Password"
                  name="password"
                  value=""
                  placeholder="Choose a strong password"
                  isRequired={true}
                  onChangeFunc={() => {}}
                  inputFieldFullWidth={true}
                  labelMinWidth="10rem"
                  marginBottom="1rem"
                />
                <div style={{ minWidth: '10rem', display: 'inline-block' }} />
                <div style={{ display: 'inline-block' }}>
                  <Button color="dark" type="submit" fontMedium asButtonTag>
                    Sign up
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Modal>
      )}
    </ThemeProvider>
  );
};

export default Home;
