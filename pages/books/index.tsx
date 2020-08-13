import { useEffect } from 'react';
import { NextPage } from 'next';
import { Post } from 'components/Post';
import { NavBar } from 'components/NavBar';
import { PageLayout } from 'hoc/PageLayout';
// import axios from 'axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksRequest, expressInterestReq } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { Spinner } from 'components/Spinner';

const Books: NextPage = (): JSX.Element => {
  // const { books } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchBooksRequest());
    }
  }, []);

  const booksState = useSelector((store: RootState) => store.books);
  const isSignedIn = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.token,
  );
  const { books, loading } = booksState;

  /**
   * Todo, when interestButton is clicked
   * The id of the post is saved
   * In the server we save the userId of the person who liked it
   */

  const handleUnsignedInterest = () => {
    alert('You need to sign in to express interest');
  };

  let posts;
  if (books) {
    posts = books.map((el: any) => {
      const { bookId, bookName, bookAuthor, bookPicturePath, userIsInterested } = el;

      // todo if the expressing interest network activity goes wrong what do we do???
      return (
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          genre="Novel"
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          interestButtonClick={() => {
            if (isSignedIn) {
              dispatch(expressInterestReq(bookId));
            } else {
              handleUnsignedInterest();
            }
          }}
          isInterested={userIsInterested}
          key={bookId}
          availableIn="Dhanmondi"
          bottomMargin
        />
      );
    });
  }

  return (
    <>
      <NavBar currentSelected="Books" userName="Arnob" />
      <PageLayout>{!loading ? posts : <Spinner />}</PageLayout>
    </>
  );
};

export default Books;
