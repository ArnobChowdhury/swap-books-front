import { useEffect, useContext } from 'react';
import { NextPage } from 'next';
import { Post } from 'modules/Post';
import { NavBar } from 'widgets/NavBar';
import { PageLayout } from 'hoc/PageLayout';
import { SocketIoContext } from 'hoc/Sockets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksRequest, expressInterestStart } from 'redux/actions/book';
import { authLogout } from 'redux/actions/auth';
import { RootState } from 'redux/reducers';
import { Spinner } from 'ui-kits/Spinner';

const Books: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socketInterest } = useContext(SocketIoContext);

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchBooksRequest());
    }
  }, []);

  const { books, loading } = useSelector((store: RootState) => store.books);
  const { name: userName } = useSelector((store: RootState) => store.user);
  const { accessToken, userId } = useSelector((s: RootState) => s.auth);

  const isSignedIn = Boolean(accessToken);

  //const { books, loading } = booksState;

  const handleUnsignedInterest = () => {
    alert('You need to sign in to express interest');
  };

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
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          onInterestButtonClick={() => {
            if (isSignedIn && socketInterest !== undefined && userName) {
              dispatch(
                expressInterestStart(
                  socketInterest,
                  userName,
                  bookId,
                  bookName,
                  bookOwnerId,
                  bookOwnerName,
                ),
              );
            } else {
              handleUnsignedInterest();
            }
          }}
          isInterested={userIsInterested}
          key={bookId}
          // todo availableIn ??? really? Let's remove this soon
          topMargin
          interestReqOnGoing={interestOnGoing}
          isOwners={bookOwnerId === userId}
        />
      );
    });
  }

  return (
    <>
      <NavBar />
      <PageLayout>{!loading ? posts : <Spinner />}</PageLayout>
    </>
  );
};

export default Books;
