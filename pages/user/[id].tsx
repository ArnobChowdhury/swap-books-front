import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import axios from 'axiosInstance';

const User: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { id: userId } = router.query;

  useEffect(() => {
    axios
      .get(`/books/${userId}`)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '4rem',
      }}
    >
      <p>{userId}</p>
    </div>
  );
};

export default User;
