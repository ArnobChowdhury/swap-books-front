import { useEffect } from 'react';
import { UserInfo } from 'components/UserInfo';
import { RootState } from 'redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileReq } from 'redux/actions/profile';

interface UserProps {
  profileId: string;
}

export const User = ({ profileId }: UserProps) => {
  const { profileName, numberOfbooksAvailable, booksSwapped } = useSelector(
    (s: RootState) => s.profile,
  );
  const { userId } = useSelector((s: RootState) => s.auth);
  const {
    booksAvailableToSwap: booksAvailableToSwapByUser,
    booksSwapped: booksSwappedByUser,
  } = useSelector((s: RootState) => s.user);

  const dispatch = useDispatch();
  const isUsers = userId === profileId;

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchProfileReq(profileId as string));
    }
  }, [profileId]);

  return (
    <UserInfo
      userName={profileName ? profileName : ''}
      numOfAvailableBooks={
        isUsers ? booksAvailableToSwapByUser : numberOfbooksAvailable
      }
      numOfBooksSwapped={isUsers ? booksSwappedByUser : booksSwapped}
    />
  );
};
