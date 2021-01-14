import { UserInfo } from './UserInfo';

export default {
  title: 'UserInfo',
  component: UserInfo,
  parameters: {
    componentSubtitle: 'User info containter in profile page',
  },
};

export const Default = (): JSX.Element => {
  return (
    <UserInfo
      userName="Sam"
      availableBooksToSwap={5}
      booksSwappedTillNow={2}
      withinYour5km
    />
  );
};
