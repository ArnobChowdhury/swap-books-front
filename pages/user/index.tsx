import { useEffect } from 'react';
import { NextPage } from 'next';
import { User } from 'components/User';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { fetchProfileBooksRequest } from 'redux/actions/book';
import { authLogout } from 'redux/actions/auth';

const UserPage: NextPage = (): JSX.Element => {
  const { userId, token } = useSelector((store: RootState) => store.auth);
  const { name: userName } = useSelector((store: RootState) => store.user);

  const { books, loading } = useSelector((store: RootState) => store.books);
  const { notifications } = useSelector((store: RootState) => store.notifications);

  const isSignedIn = Boolean(token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (process.browser && userId) {
      dispatch(fetchProfileBooksRequest(userId));
    }
  }, []);

  return (
    <User
      books={books}
      isSignedIn={isSignedIn}
      loading={loading}
      logoutFunc={() => dispatch(authLogout())}
      notifications={notifications}
      userId={userId}
      userName={userName}
      profileUserName={userName}
    />
  );
};

export default UserPage;
