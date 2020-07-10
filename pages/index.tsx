import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Landing } from '../components/Landing';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import * as Yup from 'yup';
import { authRequest } from 'redux/actions/auth';

// TODO
/**
 * 1. Make the input boxes smaller in width (Maybe follow instagram's form login page). Plnr: on hold: 1
 */
const Home: NextPage = (): JSX.Element => {
  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  const router = useRouter();

  // todo learn more about useSelector for Redux
  const token = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.token,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      router.push('/books');
    }
  }, [token]);

  const closeModal = (): void => {
    showSignUpForm && setShowSignUpForm(false);
    showLoginForm && setShowLoginForm(false);
  };

  return (
    <>
      <Landing
        loginOnClick={(): void => setShowLoginForm(!showLoginForm)}
        signupOnClick={(): void => setShowSignUpForm(!showSignUpForm)}
      />
      {(showSignUpForm || showLoginForm) && (
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
              onSubmit={({ email, password }, { setSubmitting }) => {
                const isSignup = showSignUpForm;
                dispatch(authRequest(email, password, isSignup, setSubmitting));
              }}
            >
              <Form>
                <Input
                  type="email"
                  labelText="Email:"
                  name="email"
                  placeholder="Please type your email address"
                  isRequired={true}
                  inputFieldFullWidth={true}
                  labelMinWidth="10rem"
                  marginBottom="1rem"
                />
                <Input
                  type="password"
                  labelText="Password"
                  name="password"
                  placeholder="Choose a strong password"
                  isRequired={true}
                  inputFieldFullWidth={true}
                  labelMinWidth="10rem"
                  marginBottom="1rem"
                />
                {/* todo I need to make sure that password and confirmPassword matches */}
                {showSignUpForm && (
                  <Input
                    type="password"
                    labelText="Confirm Password"
                    name="confirmPassword"
                    placeholder="Please type your chosen password again"
                    isRequired={true}
                    inputFieldFullWidth={true}
                    labelMinWidth="10rem"
                    marginBottom="1rem"
                  />
                )}
                <div style={{ minWidth: '10rem', display: 'inline-block' }} />
                <div style={{ display: 'inline-block' }}>
                  <Button color="dark" type="submit" fontMedium asButtonTag>
                    {showSignUpForm ? 'Sign up' : 'Log in'}
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Home;
