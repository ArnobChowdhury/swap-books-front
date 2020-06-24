// @ts-nocheck
import React from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

const Index: NextPage = () => {
  const token = useSelector<RootState, string>(s => s.auth.token);

  return (
    <div>
      I dont want this isolation
      <div>{token}</div>
    </div>
  );
};

export default Index;
