import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { fetchProfileReq } from 'redux/actions/profile';
import { authLogout } from 'redux/actions/auth';
import { User } from 'components/User';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { SocketIoInterestContext } from 'hoc/Sockets';
import { fetchProfileBooksRequest, expressInterestStart } from 'redux/actions/book';

const UserPage: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketIoInterestContext);

  const { profileName, profileLoading } = useSelector(
    (store: RootState) => store.profile,
  );
  const { loading: bookLoading, books } = useSelector(
    (store: RootState) => store.books,
  );

  const { name: userName } = useSelector((store: RootState) => store.user);
  const { notifications } = useSelector((store: RootState) => store.notifications);
  const { token, userId } = useSelector((store: RootState) => store.auth);

  const isSignedIn = Boolean(token);

  const router = useRouter();
  const { id: profileId } = router.query;

  useEffect(() => {
    if (process.browser && userId) {
      dispatch(fetchProfileReq(profileId as string));
      dispatch(fetchProfileBooksRequest(profileId as string));
    }
  }, []);

  const isProfileLoading = bookLoading && profileLoading;

  return (
    <User
      books={books}
      isSignedIn={isSignedIn}
      loading={isProfileLoading}
      logoutFunc={() => dispatch(authLogout())}
      notifications={notifications}
      userId={userId as string}
      profileUserName={profileName || ''}
      userName={userName}
      interestButtonClick={(bookId, bookName, bookOwnerId) => {
        if (socket != undefined && userName) {
          dispatch(
            expressInterestStart(socket, userName, bookId, bookName, bookOwnerId),
          );
        }
      }}
    />
  );
};

export default UserPage;
