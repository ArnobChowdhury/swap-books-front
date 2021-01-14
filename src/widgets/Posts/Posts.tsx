import React, { useContext, useEffect } from 'react';
import { Post } from 'modules/Post';
import { useDispatch, useSelector } from 'react-redux';
import { SocketIoContext } from 'hoc/Sockets';
import { fetchBooksRequest, expressInterestStart } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { PageLayout } from 'hoc/PageLayout';
import { Spinner } from 'ui-kits/Spinner';
import { RootContext, RootContextProps } from 'contexts/RootContext';

export const Posts = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socketInterest } = useContext(SocketIoContext);
  const { setPopupType, setShowModal } = useContext(RootContext) as RootContextProps;

  useEffect(() => {
    if (process.browser) {
      dispatch(fetchBooksRequest());
    }
  }, []);

  const { books, loading } = useSelector((store: RootState) => store.books);
  const { name: userName } = useSelector((store: RootState) => store.user);
  const { accessToken, userId } = useSelector((s: RootState) => s.auth);

  const isSignedIn = Boolean(accessToken);

  const handleUnsignedInterest = () => {
    setShowModal(true);
    setPopupType('requireLoginOrSignup');
  };

  let posts;
  if (books) {
    // posts = books.map(el => {
    posts = books.map(el => {
      const {
        bookId,
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        bookOwnerId,
        userIsInterested,
        interestOnGoing,
      } = el;

      // todo if the expressing interest network activity goes wrong what do we do???
      return (
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          bookOwnerName={bookOwnerName}
          imgUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${bookPicturePath}`}
          onInterestButtonClick={() => {
            if (isSignedIn && socketInterest !== undefined && userName) {
              dispatch(
                expressInterestStart(
                  socketInterest,
                  userName,
                  bookId,
                  bookName,
                  bookOwnerId,
                  bookOwnerName,
                ),
              );
            } else {
              handleUnsignedInterest();
            }
          }}
          isInterested={userIsInterested}
          key={bookId}
          bottomMargin
          interestReqOnGoing={interestOnGoing}
          isOwners={bookOwnerId === userId}
        />
      );
    });
  }
  // TODO is PageLayout a HOC? I don't think anymore
  // return <PageLayout>{!loading ? posts : <Spinner />}</PageLayout>;
  return (
    <PageLayout>
      {loading && <Spinner />}
      {!loading && posts}
    </PageLayout>
  );
};
