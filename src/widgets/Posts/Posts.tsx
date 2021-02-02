import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksRequest, expressInterestStart } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { Post, PostShimmer } from 'modules/Post';
import { FlexContainer } from 'ui-kits/FlexContainer';
import { FlexItem } from 'ui-kits/FlexItem';
import { RootContext, RootContextProps } from 'contexts/RootContext';

export const Posts = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socketInterest } = useContext(SocketIoContext);
  const { setPopupType, setShowModal } = useContext(RootContext) as RootContextProps;

  const { books, loading } = useSelector((store: RootState) => store.books);
  const { name: userName, userLon, userLat } = useSelector(
    (store: RootState) => store.user,
  );
  const { accessToken, userId } = useSelector((s: RootState) => s.auth);
  useEffect(() => {
    if (process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest(userLon, userLat));
    }
  }, [userLon, userLat]);

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
        <FlexItem isFlexAndCenter key={bookId} defaultSize={100} sm={50}>
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
                    !userIsInterested,
                  ),
                );
              } else {
                handleUnsignedInterest();
              }
            }}
            isInterested={userIsInterested}
            topMargin
            interestReqOnGoing={interestOnGoing}
            isOwners={bookOwnerId === userId}
          />
        </FlexItem>
      );
    });
  }
  // TODO is PageLayout a HOC? I don't think it is anymore
  return (
    <FlexContainer justify="center" alignItems="center">
      {loading && (
        <>
          <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
            <PostShimmer />
          </FlexItem>
          <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
            <PostShimmer />
          </FlexItem>
          <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
            <PostShimmer />
          </FlexItem>
          <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
            <PostShimmer />
          </FlexItem>
        </>
      )}
      {!loading && posts}
    </FlexContainer>
  );
};
