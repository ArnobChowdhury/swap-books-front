import { Input } from 'components/Input';
import { Checkbox } from 'components/Checkbox';
import { Button } from 'ui-kits/Button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createUserReq, createUserRefresh } from 'redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import {
  CenterContainer,
  LoaderWrapper,
  TryAgainButtonWrapper,
} from './SignupWidget.styles';
import { LoaderBook } from 'assets/LoaderBook';
import { RequestResult } from 'components/RequestResult';

const LinkToTermsAndCondition = () => {
  return (
    <p>
      I agree to the <a href="/terms">terms and conditions.</a>
    </p>
  );
};

export const SignupWidget = (): JSX.Element => {
  const {
    userCreationOnGoing,
    userCreationSuccessfulMsg,
    userCreationError,
  } = useSelector((s: RootState) => s.user);

  const dispatch = useDispatch();

  // TODO Confirm password field should match Password field
  return (
    <CenterContainer>
      {userCreationOnGoing && (
        <LoaderWrapper>
          <LoaderBook text="Submitting" />
        </LoaderWrapper>
      )}
      {userCreationSuccessfulMsg && (
        <RequestResult msg={userCreationSuccessfulMsg} reqStatus="success" />
      )}
      {userCreationError && (
        <>
          <RequestResult msg={userCreationError.message} reqStatus="error" />
          <TryAgainButtonWrapper>
            <Button onClick={() => dispatch(createUserRefresh())}>Try Again</Button>
          </TryAgainButtonWrapper>
        </>
      )}
      {!userCreationOnGoing && !userCreationSuccessfulMsg && !userCreationError && (
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            ageConfirmation: false,
            termsConfirmation: false,
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .max(26, 'Too long. Must be within 26 characters.')
              .required('Required'),
            email: Yup.string()
              .email('Invalid email address.')
              .required('Required'),
            password: Yup.string()
              .required('Password needed')
              .min(8, 'Too short. Needs to have min. 8 characters.')
              .matches(/[a-zA-Z]/, 'Password can only contain latin letters.'),
            confirmPassword: Yup.string()
              .required('Confirm Password field cannot be left empty.')
              .test('passwords-match', 'Passwords must match', function(value) {
                return this.parent.password === value;
              }),
            ageConfirmation: Yup.boolean().oneOf(
              [true],
              'You must be at least be at least 13 years or older.',
            ),
            termsConfirmation: Yup.boolean().oneOf(
              [true],
              'You must agree to the terms and conditions.',
            ),
          })}
          onSubmit={(
            { username, email, password, ageConfirmation, termsConfirmation },
            { setSubmitting },
          ) => {
            dispatch(
              createUserReq(
                username,
                email,
                password,
                ageConfirmation,
                termsConfirmation,
                setSubmitting,
              ),
            );
          }}
        >
          <Form>
            <Input
              name="username"
              labelText="Username"
              type="text"
              labelAtTop
              isRequired
              inputFieldFullWidth
            />
            <Input
              name="email"
              labelText="Email"
              type="email"
              labelAtTop
              isRequired
              inputFieldFullWidth
            />
            <Input
              name="password"
              labelText="Password"
              type="password"
              labelAtTop
              isRequired
              inputFieldFullWidth
            />
            <Input
              name="confirmPassword"
              labelText="Confirm Password"
              type="password"
              labelAtTop
              isRequired
              inputFieldFullWidth
            />
            <Checkbox labelText="I am 13 years or older." name="ageConfirmation" />
            <Checkbox
              labelText={<LinkToTermsAndCondition />}
              name="termsConfirmation"
            />
            <Button color="blue" type="submit" asButtonTag>
              Submit
            </Button>
          </Form>
        </Formik>
      )}
    </CenterContainer>
  );
};
