import React, { useState } from 'react';
import { NextPage } from 'next';
import { TopBar } from 'widgets/TopBar';
import { ActivityBar } from 'widgets/ActivityBar';
import { Location } from 'widgets/Location';
import { Posts } from 'widgets/Posts';
import { RootContext, PopupType } from 'contexts/RootContext';
import { useWindowSize } from 'hooks';
import { mediumScreen } from 'mediaConfig';
import { Modal } from 'ui-kits/Modal';
import { Login, LoginCredentials } from 'modules/Login';
import { AddBook, BookType } from 'modules/AddBook';
import { authRequest } from 'redux/actions/auth';
import { addABookRequest } from 'redux/actions/book';
import { FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';

const Root: NextPage = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType | null>(null);

  const { width } = useWindowSize();

  const dispatch = useDispatch();
  const handleLoginSubmit = (
    { email, password }: LoginCredentials,
    { setSubmitting }: FormikHelpers<LoginCredentials>,
  ) => {
    dispatch(authRequest(email, password, setSubmitting, setShowModal));
  };

  const handleAddBookSubmit = (
    { bookname, bookauthor, bookimage }: BookType,
    { setSubmitting }: FormikHelpers<BookType>,
  ) => {
    dispatch(
      addABookRequest(bookname, bookauthor, bookimage, setSubmitting, setShowModal),
    );
  };

  return (
    <RootContext.Provider
      value={{ showModal, setShowModal, popupType, setPopupType }}
    >
      {showModal && popupType === 'login' && (
        <Modal onClick={() => setShowModal(false)}>
          <Login onSubmit={handleLoginSubmit} />
        </Modal>
      )}
      {showModal && popupType === 'addABook' && (
        <Modal onClick={() => setShowModal(false)}>
          <AddBook onSubmit={handleAddBookSubmit} />
        </Modal>
      )}
      {showModal && popupType === 'location' && (
        <Modal largeModal onClick={() => setShowModal(false)}>
          <Location />
        </Modal>
      )}
      <TopBar activityBar={width >= mediumScreen && <ActivityBar />} />
      {width < mediumScreen && <ActivityBar />}
      <Posts />
    </RootContext.Provider>
  );
};

export default Root;
