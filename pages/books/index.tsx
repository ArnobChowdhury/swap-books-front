import { useEffect } from 'react';
import { NextPage } from 'next';
import { Post } from 'components/Post';
import { NavBar } from 'components/NavBar';
import { PageLayout } from 'hoc/PageLayout';
// import axios from 'axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksRequest } from 'redux/actions/book';
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
  const { books, loading } = booksState;

  let posts;
  if (books) {
    posts = books.map((el: any) => {
      const { bookId, bookName, bookAuthor, bookPicturePath } = el;

      return (
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          genre="Novel"
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          interestButtonClick={() => {
            '';
          }}
          isInterested={true}
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
