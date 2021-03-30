import { Input } from 'components/Input';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { resetPasswordReq } from 'redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { IconContainer, CenterContainer, ReqMsg } from './ResetPassWidget.styles';
import { Tick } from 'assets/Tick';
import { Danger } from 'assets/Danger';

export const ResetPassWidget = ({ token }: { token: string }): JSX.Element => {
  const { resetPassLoading: reqOnGoing, resetPassMsg, resetPassErr } = useSelector(
    (s: RootState) => s.auth,
  );

  const dispatch = useDispatch();

  // TODO Confirmed password should match password in validation schema
  return (
    <CenterContainer>
      {reqOnGoing && <Spinner />}
      {resetPassMsg && (
        <>
          <IconContainer>
            <Tick size={50} />
          </IconContainer>
          <ReqMsg>{resetPassMsg}</ReqMsg>
        </>
      )}
      {resetPassErr && (
        <>
          <IconContainer>
            <Danger size={50} />
          </IconContainer>
          <ReqMsg>{resetPassErr.message}</ReqMsg>
        </>
      )}
      {!resetPassMsg && !resetPassErr && (
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required('Password needed')
              .min(8, 'Too short. Needs to have min. 8 characters')
              .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
          })}
          onSubmit={({ password }, { setSubmitting }) => {
            dispatch(resetPasswordReq(password, token, setSubmitting));
            // TODO: RIGHT NEW ACTION
          }}
        >
          <Form>
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
            <Button isFullWidth color="blue" type="submit" asButtonTag>
              Reset Password
            </Button>
          </Form>
        </Formik>
      )}
    </CenterContainer>
  );
};
