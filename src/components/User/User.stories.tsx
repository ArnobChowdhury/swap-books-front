import { User } from './User';

export default {
  title: 'components/User',
  component: User,
};

export const Default = (): JSX.Element => {
  const books = [
    {
      bookId: '5f5a72c67a4e0f536d0c8c50',
      bookName: 'Inferno',
      bookAuthor: 'Dan Brown',
      bookPicturePath: 'images/2020-09-10T18-39-01.920Z-inferno.jpg',
      bookOwnerId: '5f2cf359d581ac22e4626a8a',
      bookOwnerName: 'arnob',
      userIsInterested: false,
      interestOnGoing: false,
      interestReqError: null,
    },
    {
      bookId: '5f5a736b7a4e0f536d0c8c51',
      bookName: 'Holud Himu Kalo Rab',
      bookAuthor: 'Humayun Ahmed',
      bookPicturePath: 'images/2020-09-10T18-41-47.475Z-holudhhimukalorab.png',
      bookOwnerId: '5f2cf359d581ac22e4626a8a',
      bookOwnerName: 'arnob',
      userIsInterested: false,
      interestOnGoing: false,
      interestReqError: null,
    },
  ];

  return (
    <User
      books={books}
      userName="Sami"
      isSignedIn
      logoutFunc={() => {
        /** */
      }}
      loading={false}
      notifications={[]}
      profileUserName="Jon"
      userId="12asdf123435as"
      interestButtonClick={() => {
        /** */
      }}
    />
  );
};
