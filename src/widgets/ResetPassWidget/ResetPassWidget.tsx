import { Input } from 'components/Input';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { resetPasswordReq, checkResetPasswordLinkReq } from 'redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { CenterContainer } from 'ui-kits/CenterContainer';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { RequestResult } from 'components/RequestResult';
import { LoaderBook } from 'assets/LoaderBook';

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
  const showLoader = linkCheckOngoing || resetPassLoading;
  return (
    <CenterContainer>
      {showLoader && (
        <LoaderBook text={linkCheckOngoing ? 'Checking link' : 'Submitting'} />
      )}
      {resetPassMsg && <RequestResult msg={resetPassMsg} reqStatus="success" />}
      {resetPassErr && (
        <RequestResult msg={resetPassErr.message} reqStatus="error" />
      )}
      {isValidLink && !showLoader && !resetPassMsg && !resetPassErr && (
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required('Password needed.')
              .min(8, 'Too short. Needs to have min. 8 characters')
              .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                'Password needs at least one lowercase letter, one uppercase letter and one number.',
              ),
            confirmPassword: Yup.string()
              .required('Confirm Password field cannot be left empty.')
              .test('passwords-match', 'Passwords must match', function(value) {
                return this.parent.password === value;
              }),
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
              trimWhiteSpaceOnBlur={false}
            />
            <Input
              name="confirmPassword"
              labelText="Confirm Password"
              type="password"
              labelAtTop
              isRequired
              inputFieldFullWidth
              trimWhiteSpaceOnBlur={false}
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
