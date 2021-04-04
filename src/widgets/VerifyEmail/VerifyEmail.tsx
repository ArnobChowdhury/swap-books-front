import { useEffect } from 'react';
import { verifyEmailReq } from 'redux/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { CenterContainer, LoaderWrapper } from './VerifyEmail.styles';
import { useRouter } from 'next/router';
import { RequestResult } from 'components/RequestResult';
import { LoaderBook } from 'assets/LoaderBook';

export const VerifyEmail = (): JSX.Element => {
  const {
    verifyEmailReqOnGoing,
    verifyEmailSuccessMsg,
    verifyEmailErr,
  } = useSelector((s: RootState) => s.user);

  const dispatch = useDispatch();

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      dispatch(verifyEmailReq(token as string));
    }
  }, [token]);

  return (
    <CenterContainer>
      {verifyEmailReqOnGoing && (
        <LoaderWrapper>
          <LoaderBook text="Verifying" />
        </LoaderWrapper>
      )}
      {verifyEmailSuccessMsg && (
        <RequestResult msg={verifyEmailSuccessMsg} reqStatus="success" />
      )}
      {verifyEmailErr && (
        <RequestResult msg={verifyEmailErr.message} reqStatus="error" />
      )}
    </CenterContainer>
  );
};
