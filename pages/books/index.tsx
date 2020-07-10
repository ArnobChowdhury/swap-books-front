import { NextPage } from 'next';

const Books: NextPage = (): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        border: '1px solid green',
      }}
    >
      <div style={{ width: '120px', height: '100%' }}>
        {' '}
        this is my book and image{' '}
      </div>
      <div style={{ flexGrow: 1 }}>
        <h3>Book: The Alchemist</h3>
        <p>Author: Paulo Coelho</p>
      </div>
    </div>
  );
};

export default Books;
