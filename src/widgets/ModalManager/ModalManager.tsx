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
import { UserNav } from 'widgets/UserNav';
import { SwapMatches } from 'widgets/SwapMatches';
import { RootState } from 'redux/reducers';
import { RootContextProps, RootContext } from 'contexts/RootContext';
import { authRequest } from 'redux/actions/auth';
import { addABookRequest, addABookRefresh } from 'redux/actions/book';
import { HOME_ROUTE, USER_ROUTE } from 'frontEndRoutes';
import { useWindowSize } from 'hooks';

export const ModalManager = (): JSX.Element => {
  const {
    showModal,
    setPopupType,
    setShowModal,
    popupType,
    selectedTabUserProfile,
  } = useContext(RootContext) as RootContextProps;

  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname, query } = router;
  const { id: profileId } = query;

  const { width } = useWindowSize();
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
    const shouldAddToPosts =
      pathname === HOME_ROUTE ||
      (pathname === USER_ROUTE &&
        profileId === userId &&
        selectedTabUserProfile === 'Available to Swap');
    dispatch(
      addABookRequest(
        bookname,
        bookauthor,
        bookimage,
        shouldAddToPosts,
        setSubmitting,
      ),
    );
  };

  const handleAddAnotherBook = () => {
    dispatch(addABookRefresh());
  };

  const handleAddBookButtonClick = () => {
    dispatch(addABookRefresh());
    setPopupType('addABook');
  };

  const { loading: loginSubmitting, error, accessToken, userId } = useSelector(
    (s: RootState) => s.auth,
  );
  const { addBookReqOnGoing, addBookReqErr, addBookReqSuccessMsg } = useSelector(
    (s: RootState) => s.books,
  );

  const isSignedIn = Boolean(accessToken);

  return (
    <>
      {showModal && popupType === 'login' && (
        <Modal
          onClick={() => setShowModal(false)}
          formSubmitting={loginSubmitting}
          currentWidth={width}
        >
          <Login onSubmit={handleLoginSubmit} requestErrorMsg={error?.message} />
        </Modal>
      )}
      {showModal && popupType === 'addABook' && (
        <Modal
          onClick={() => setShowModal(false)}
          formSubmitting={addBookReqOnGoing}
          currentWidth={width}
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
        <Modal onClick={() => setShowModal(false)} currentWidth={width}>
          {!isSignedIn && <NeedAuth />}
          {isSignedIn && <NeedBook onAddButtonClick={handleAddBookButtonClick} />}
        </Modal>
      )}
      {showModal && popupType === 'location' && (
        <Modal largeModal onClick={() => setShowModal(false)} currentWidth={width}>
          <Location />
        </Modal>
      )}
      {showModal && popupType === 'editBook' && <EditBook />}
      {showModal && popupType === 'swapBook' && <SwapMatches />}
      {showModal && popupType === 'userOptions' && (
        <Modal
          opensInBottom
          onClick={() => {
            setShowModal(false);
          }}
          currentWidth={width}
        >
          <UserNav />
        </Modal>
      )}
    </>
  );
};
