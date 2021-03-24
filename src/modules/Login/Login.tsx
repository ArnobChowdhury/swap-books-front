import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'components/Input';
import * as Yup from 'yup';
import { Button } from 'ui-kits/Button';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginProps {
  onSubmit: (
    loginCreds: LoginCredentials,
    formikHelpers: FormikHelpers<LoginCredentials>,
  ) => void;
}

export const Login = ({ onSubmit }: LoginProps): JSX.Element => {
  return (
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
        />
        <Button color="blue" type="submit" asButtonTag>
          Log in
        </Button>
      </Form>
    </Formik>
  );
};
