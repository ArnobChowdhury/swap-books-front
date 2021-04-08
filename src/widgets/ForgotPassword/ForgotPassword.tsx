import { Input } from 'components/Input';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forgotPasswordReq } from 'redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { CenterContainer } from './ForgotPassword.styles';
import { RequestResult } from 'components/RequestResult';

export const ForgotPassword = (): JSX.Element => {
  const {
    forgotPassLoading: reqOnGoing,
    forgotPassMsg,
    forgotPassErr,
  } = useSelector((s: RootState) => s.auth);

  const dispatch = useDispatch();

  return (
    <CenterContainer>
      {reqOnGoing && <Spinner />}
      {forgotPassMsg && <RequestResult msg={forgotPassMsg} reqStatus="success" />}
      {forgotPassErr && (
        <RequestResult msg={forgotPassErr.message} reqStatus="error" />
      )}
      {!forgotPassMsg && !forgotPassErr && (
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address.')
              .required('Required field.'),
          })}
          onSubmit={({ email }, { setSubmitting }) => {
            dispatch(forgotPasswordReq(email, setSubmitting));
          }}
        >
          <Form>
            <Input
              name="email"
              labelText="Email"
              type="email"
              labelAtTop
              isRequired
              inputFieldFullWidth
              trimWhiteSpaceOnBlur
            />
            <Button isFullWidth color="blue" type="submit" asButtonTag>
              Retrieve Password
            </Button>
          </Form>
        </Formik>
      )}
    </CenterContainer>
  );
};
