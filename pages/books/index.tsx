import { useEffect, useContext } from 'react';
import { NextPage } from 'next';
import { Post } from 'components/Post';
import { NavBar } from 'components/NavBar';
import { PageLayout } from 'hoc/PageLayout';
import { SocketIoInterestContext } from 'hoc/Sockets';
// import axios from 'axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchBooksRequest, expressInterestReq } from 'redux/actions/book';
import { fetchBooksRequest, expressInterestStart } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { Spinner } from 'components/Spinner';

const Books: NextPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketIoInterestContext);

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchBooksRequest());
    }
  }, []);

  const { books, loading } = useSelector((store: RootState) => store.books);
  const { name: userName } = useSelector((store: RootState) => store.user);
  const { token, userId } = useSelector((s: RootState) => s.auth);

  const isSignedIn = Boolean(token);

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
          genre="Novel"
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          interestButtonClick={() => {
            if (isSignedIn && socket !== undefined && userName) {
              dispatch(expressInterestStart(socket, userName, bookId));
            } else {
              handleUnsignedInterest();
            }
          }}
          isInterested={userIsInterested}
          key={Number(bookId)}
          // todo availableIn ??? really? Let's remove this soon
          availableIn="Dhanmondi"
          bottomMargin
          interestReqOnGoing={interestOnGoing}
          isOwners={bookOwnerId === userId}
        />
      );
    });
  }

  return (
    <>
      <NavBar isSignedIn={isSignedIn} currentSelected="Books" userName={userName} />
      <PageLayout>{!loading ? posts : <Spinner />}</PageLayout>
    </>
  );
};

export default Books;
