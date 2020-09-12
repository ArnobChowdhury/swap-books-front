import { useEffect } from 'react';
import { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { fetchVisitingProfileBooksReq } from 'redux/actions/visitingProfileBooks';

const User: NextPage = (): JSX.Element => {
  const { userId } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (process.browser && userId) {
      dispatch(fetchVisitingProfileBooksReq(userId));
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '4rem',
      }}
    >
      <p>{userId}</p>
    </div>
  );
};

export default User;
