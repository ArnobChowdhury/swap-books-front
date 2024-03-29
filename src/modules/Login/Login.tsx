import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'components/Input';
import * as Yup from 'yup';
import { Button } from 'ui-kits/Button';
import { BadInput } from 'ui-kits/BadInput';
import { ForgotPassWrapper, ForgotPassLink, LogoBox } from './Login.styles';
import { LogoIcon } from 'assets/LogoIcon';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginProps {
  onSubmit: (
    loginCreds: LoginCredentials,
    formikHelpers: FormikHelpers<LoginCredentials>,
  ) => void;
  requestErrorMsg?: string;
}

export const Login = ({ onSubmit, requestErrorMsg }: LoginProps): JSX.Element => {
  return (
    <>
      <LogoBox>
        <LogoIcon width={30} />
      </LogoBox>
      {requestErrorMsg && <BadInput>{requestErrorMsg}</BadInput>}
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required field.'),
          password: Yup.string().required('Password needed'),
        })}
        onSubmit={onSubmit}
      >
        <Form>
          <Input
            type="email"
            labelText="Email"
            name="email"
            placeholder="Please type your email address"
            isRequired={true}
            inputFieldFullWidth={true}
            labelMinWidth="10rem"
            marginBottom="1rem"
            labelAtTop
            autoFocus
            trimWhiteSpaceOnBlur
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
            labelAtTop
            trimWhiteSpaceOnBlur={false}
          />
          <ForgotPassWrapper>
            <ForgotPassLink href="/forgot-password">Forgot Password?</ForgotPassLink>
          </ForgotPassWrapper>
          <Button color="blue" type="submit" asButtonTag>
            Log in
          </Button>
        </Form>
      </Formik>
    </>
  );
};
