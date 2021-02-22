import { useEffect } from 'react';
import { UserInfo } from 'components/UserInfo';
import { NavBar } from 'widgets/NavBar';
import { Spinner } from 'ui-kits/Spinner';
import { Post } from 'modules/Post';
import { PageLayout } from 'hoc/PageLayout';
import { BookShape } from 'redux/reducers/books';
import { NotificationShape } from 'redux/reducers/notifications';
import { RootState } from 'redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileReq } from 'redux/actions/profile';
import { fetchProfileBooksRequest, expressInterestStart } from 'redux/actions/book';
import { Posts } from 'widgets/Posts';

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

  //todo Everything in userInfo is hardcoded

  return (
    <UserInfo
      userName={profileName ? profileName : ''}
      numOfAvailableBooks={numberOfbooksAvailable}
    />
  );
};
