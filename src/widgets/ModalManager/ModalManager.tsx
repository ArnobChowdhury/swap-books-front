import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { RootContextProps, RootContext } from 'contexts/RootContext';
import { Modal } from 'ui-kits/Modal';
import { Login, LoginCredentials } from 'modules/Login';
import { AddBook, BookType } from 'modules/AddBook';
import { authRequest } from 'redux/actions/auth';
import { addABookRequest } from 'redux/actions/book';
import { FormikHelpers } from 'formik';
import { NeedAuth } from 'widgets/NeedAuth';
import { Location } from 'widgets/Location';

export const ModalManager = (): JSX.Element => {
  const { showModal, setShowModal, popupType } = useContext(
    RootContext,
  ) as RootContextProps;

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
    <>
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
      {showModal && popupType === 'requireLoginOrSignup' && (
        <Modal onClick={() => setShowModal(false)}>
          <NeedAuth />
        </Modal>
      )}
      {showModal && popupType === 'location' && (
        <Modal largeModal onClick={() => setShowModal(false)}>
          <Location />
        </Modal>
      )}
    </>
  );
};
