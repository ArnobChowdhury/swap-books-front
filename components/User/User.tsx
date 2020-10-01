import { UserInfo } from 'components/UserInfo';
import { NavBar } from 'components/NavBar';
import { Spinner } from 'components/Spinner';
import { Post } from 'components/Post';
import { PageLayout } from 'hoc/PageLayout';
import { BookShape } from 'redux/reducers/books';
import { NotificationShape } from 'redux/reducers/notifications';

interface UserProps {
  books: BookShape[] | null;
  userName: string | null;
  userId: string | null;
  profileUserName: string | null;
  isSignedIn: boolean;
  loading: boolean;
  logoutFunc: () => void;
  notifications: NotificationShape[];
  interestButtonClick?: (
    bookId: string,
    bookName: string,
    bookOwnerId: string,
    bookOwnerName: string,
  ) => void;
}

export const User = ({
  books,
  userName,
  userId,
  profileUserName,
  isSignedIn = false,
  loading,
  logoutFunc,
  notifications,
  interestButtonClick,
}: UserProps) => {
  let posts;
  if (books) {
    posts = books.map(el => {
      const {
        bookId,
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        bookOwnerId,
        userIsInterested,
        interestOnGoing,
      } = el;

      // todo if the expressing interest network activity goes wrong what do we do???

      return (
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          bookOwnerName={bookOwnerName}
          genre="Novel"
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          isInterested={userIsInterested}
          key={bookId}
          // todo availableIn ??? really? Let's remove this soon
          availableIn="Dhanmondi"
          bottomMargin
          interestReqOnGoing={interestOnGoing}
          isOwners={bookOwnerId === userId}
          interestButtonClick={() => {
            if (interestButtonClick != undefined) {
              interestButtonClick(bookId, bookName, bookOwnerId, bookOwnerName);
            }
          }}
        />
      );
    });
  }

  //todo Everything in userInfo is hardcoded

  return (
    <>
      <NavBar
        isSignedIn={isSignedIn}
        currentSelected="Books"
        userName={userName}
        notifications={notifications}
        logoutFunc={logoutFunc}
      />
      <PageLayout>
        {!loading && (
          <>
            <UserInfo
              userName={profileUserName ? profileUserName : ''}
              withinYour5km
              booksSwappedTillNow={5}
              availableBooksToSwap={5}
            />
            {posts}
          </>
        )}
        {loading && <Spinner />}
      </PageLayout>
    </>
  );
};
