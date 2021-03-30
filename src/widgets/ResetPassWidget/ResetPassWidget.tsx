import { Input } from 'components/Input';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { resetPasswordReq, checkResetPasswordLinkReq } from 'redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { IconContainer, CenterContainer, ReqMsg } from './ResetPassWidget.styles';
import { Tick } from 'assets/Tick';
import { Danger } from 'assets/Danger';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const ResetPassWidget = (): JSX.Element => {
  const { resetPassLoading, resetPassMsg, resetPassErr } = useSelector(
    (s: RootState) => s.auth,
  );

  const dispatch = useDispatch();

  const router = useRouter();
  const { id, token } = router.query;

  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [linkCheckOngoing, setLinkCheckOngoing] = useState<boolean>(true);

  useEffect(() => {
    if (id && token) {
      dispatch(
        checkResetPasswordLinkReq(
          id as string,
          token as string,
          setIsValidLink,
          setLinkCheckOngoing,
        ),
      );
    }
  }, [id, token]);

  // TODO Confirmed password should match password in validation schema
  return (
    <CenterContainer>
      {(linkCheckOngoing || resetPassLoading) && <Spinner />}
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
      {isValidLink && !resetPassMsg && !resetPassErr && (
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
            confirmPassword: Yup.string().test(
              'passwords-match',
              'Passwords must match',
              function(value) {
                return this.parent.password === value;
              },
            ),
          })}
          onSubmit={({ password }, { setSubmitting }) => {
            dispatch(
              resetPasswordReq(
                id as string,
                password,
                token as string,
                setSubmitting,
              ),
            );
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
