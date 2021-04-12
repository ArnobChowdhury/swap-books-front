import { useEffect } from 'react';
import { UserInfo } from 'components/UserInfo';
import { RootState } from 'redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileReq } from 'redux/actions/profile';

interface UserProps {
  profileId: string;
}

export const User = ({ profileId }: UserProps) => {
  const { profileName, numberOfbooksAvailable } = useSelector(
    (s: RootState) => s.profile,
  );
  const { books } = useSelector((s: RootState) => s.books);
  // const { name: userName } = useSelector((store: RootState) => store.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchProfileReq(profileId as string));
    }
  }, [profileId]);

  return (
    <UserInfo
      userName={profileName ? profileName : ''}
      numOfAvailableBooks={numberOfbooksAvailable}
    />
  );
};
