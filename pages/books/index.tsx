import { NextPage } from 'next';
import { Post } from 'components/Post';
import { NavBar } from 'components/NavBar';
import { PageLayout } from 'hoc/PageLayout';
import axios from 'axiosInstance';

export async function getServerSideProps() {
  const res = await axios.get('/books');
  const { books } = res.data;

  return {
    props: {
      books,
    },
  };
}

const Books: NextPage = (props: any): JSX.Element => {
  const { books } = props;

  const posts = books.map((el: any, ind: number) => {
    const { bookName, bookAuthor, bookPicturePath } = el;
    return (
      <Post
        bookName={bookName}
        bookAuthor={bookAuthor}
        genre="Novel"
        imgUrl={`http://localhost:4000/${bookPicturePath}`}
        interestButtonClick={() => {
          '';
        }}
        isInterested={true}
        key={ind}
        availableIn="Dhanmondi"
        bottomMargin
      />
    );
  });
  return (
    <>
      <NavBar currentSelected="Books" userName="Arnob" />
      <PageLayout>{posts}</PageLayout>
    </>
  );
};

export default Books;
