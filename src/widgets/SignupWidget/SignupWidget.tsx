import { Input } from 'components/Input';
import { Checkbox } from 'components/Checkbox';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createUserReq } from 'redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { CenterContainer, PageContainer } from './SignupWidget.styles';

const LinkToTermsAndCondition = () => {
  return (
    <p>
      I agree to the <a href="/terms">terms and conditions.</a>
    </p>
  );
};

export const SignupWidget = (): JSX.Element => {
  const userCreationOnGoing = useSelector(
    (s: RootState) => s.user.userCreationOnGoing,
  );

  //   const userHasBeenCreated = useSelector(
  //     (s: RootState) => s.user.userCreationSuccessful,
  //   );

  const dispatch = useDispatch();
  return (
    <PageContainer>
      <CenterContainer>
        {userCreationOnGoing && <Spinner />}
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
            username: Yup.string().required('Required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Required'),
            password: Yup.string()
              .required('Password needed')
              .min(8, 'Too short. Needs to have min. 8 characters')
              .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
            ageConfirmation: Yup.boolean().oneOf(
              [true],
              'You must be at least be at least 13 years or older',
            ),
            termsConfirmation: Yup.boolean().oneOf(
              [true],
              'You must be at least be at least 13 years or older',
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
            <Button color="pink" type="submit" asButtonTag>
              Submit
            </Button>
          </Form>
        </Formik>
      </CenterContainer>
    </PageContainer>
  );
};
