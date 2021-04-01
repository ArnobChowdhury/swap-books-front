import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootContextProps, RootContext } from 'contexts/RootContext';
import { Modal } from 'components/Modal';
import { Login, LoginCredentials } from 'modules/Login';
import { AddBook, BookType } from 'modules/AddBook';
import { authRequest } from 'redux/actions/auth';
import { addABookRequest, addABookRefresh } from 'redux/actions/book';
import { FormikHelpers } from 'formik';
import { NeedAuth } from 'modules/NeedAuth';
import { Location } from 'widgets/Location';
import { RootState } from 'redux/reducers';

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

  const handleAddAnotherBook = () => {
    dispatch(addABookRefresh());
  };

  const { loading: loginSubmitting, error } = useSelector((s: RootState) => s.auth);
  const { addBookReqOnGoing, addBookReqErr, addBookReqSuccessMsg } = useSelector(
    (s: RootState) => s.books,
  );

  return (
    <>
      {showModal && popupType === 'login' && (
        <Modal onClick={() => setShowModal(false)} formSubmitting={loginSubmitting}>
          <Login onSubmit={handleLoginSubmit} requestErrorMsg={error?.message} />
        </Modal>
      )}
      {showModal && popupType === 'addABook' && (
        <Modal
          onClick={() => setShowModal(false)}
          formSubmitting={addBookReqOnGoing}
        >
          <AddBook
            onSubmit={handleAddBookSubmit}
            successMsg={addBookReqSuccessMsg}
            errMsg={addBookReqErr?.message}
            onAddAnother={handleAddAnotherBook}
          />
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
