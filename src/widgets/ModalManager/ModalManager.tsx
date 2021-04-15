import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { FormikHelpers } from 'formik';
import { Modal } from 'components/Modal';
import { Login, LoginCredentials } from 'modules/Login';
import { AddBook, BookType } from 'modules/AddBook';
import { NeedAuth } from 'modules/NeedAuth';
import { NeedBook } from 'modules/NeedBook';
import { EditBook } from 'widgets/EditBook';
import { Location } from 'widgets/Location';
import { RootState } from 'redux/reducers';
import { RootContextProps, RootContext } from 'contexts/RootContext';
import { authRequest } from 'redux/actions/auth';
import { addABookRequest, addABookRefresh } from 'redux/actions/book';

export const ModalManager = (): JSX.Element => {
  const { showModal, setPopupType, setShowModal, popupType } = useContext(
    RootContext,
  ) as RootContextProps;

  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;

  const handleLoginSubmit = (
    { email, password }: LoginCredentials,
    { setSubmitting }: FormikHelpers<LoginCredentials>,
  ) => {
    dispatch(authRequest(email, password, setSubmitting, setShowModal, pathname));
  };

  const handleAddBookSubmit = (
    { bookname, bookauthor, bookimage }: BookType,
    { setSubmitting }: FormikHelpers<BookType>,
  ) => {
    dispatch(addABookRequest(bookname, bookauthor, bookimage, setSubmitting));
  };

  const handleAddAnotherBook = () => {
    dispatch(addABookRefresh());
  };

  const handleAddBookButtonClick = () => {
    dispatch(addABookRefresh());
    setPopupType('addABook');
  };

  const { loading: loginSubmitting, error, accessToken } = useSelector(
    (s: RootState) => s.auth,
  );
  const { addBookReqOnGoing, addBookReqErr, addBookReqSuccessMsg } = useSelector(
    (s: RootState) => s.books,
  );

  const isSignedIn = Boolean(accessToken);

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
          {!isSignedIn && <NeedAuth />}
          {isSignedIn && <NeedBook onAddButtonClick={handleAddBookButtonClick} />}
        </Modal>
      )}
      {showModal && popupType === 'location' && (
        <Modal largeModal onClick={() => setShowModal(false)}>
          <Location />
        </Modal>
      )}
      {showModal && popupType === 'editBook' && <EditBook />}
    </>
  );
};
