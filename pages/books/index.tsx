import { NextPage } from 'next';
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
      <div
        style={{
          display: 'flex',
          boxSizing: 'border-box',
          border: '1px solid green',
        }}
        key={ind}
      >
        <div style={{ width: '120px', height: '100%' }}>
          <img src={`http://localhost:4000/${bookPicturePath}`} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <h3>Book: {bookName}</h3>
          <p>Author: {bookAuthor} </p>
        </div>
      </div>
    );
  });
  return <>{posts}</>;
};

export default Books;
