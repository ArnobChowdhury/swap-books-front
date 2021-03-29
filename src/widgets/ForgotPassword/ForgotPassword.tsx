import { Input } from 'components/Input';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forgotPasswordReq } from 'redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { CenterContainer, ReqMsg, IconContainer } from './ForgotPassword.styles';
import { Tick } from 'assets/Tick';
import { Danger } from 'assets/Danger';

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
      {forgotPassMsg && (
        <>
          <IconContainer>
            <Tick size={50} />
          </IconContainer>
          <ReqMsg>{forgotPassMsg}</ReqMsg>
        </>
      )}
      {forgotPassErr && (
        <>
          <IconContainer>
            <Danger size={50} />
          </IconContainer>
          <ReqMsg>{forgotPassErr.message}</ReqMsg>
        </>
      )}
      {!forgotPassMsg && !forgotPassErr && (
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Required'),
          })}
          onSubmit={({ email }, { setSubmitting }) => {
            dispatch(forgotPasswordReq(email, setSubmitting));
            // TODO: RIGHT NEW ACTION
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
