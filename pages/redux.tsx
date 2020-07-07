// @ts-nocheck
import React from 'react';
import { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers';
import { authRequest } from 'redux/actions/auth';

const Index: NextPage = () => {
  const token = useSelector<RootState, string>(s => s.auth.token);
  const dispatch = useDispatch();

  return (
    <div>
      I dont want this isolation
      <div>{token}</div>
      <button onClick={() => dispatch(authRequest('my@gmail.com', 'mypassword'))}>
        Send email
      </button>
    </div>
  );
};

export default Index;
