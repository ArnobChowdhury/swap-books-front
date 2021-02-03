import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksRequest, expressInterestStart } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { Post, PostShimmer } from 'modules/Post';
import { FlexContainer } from 'ui-kits/FlexContainer';
import { FlexItem } from 'ui-kits/FlexItem';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { mediumScreen } from 'mediaConfig';
import { useOnScreen, useWindowSize } from 'hooks';

const PostShimmerComponent = React.forwardRef(
  (_props, ref: React.Ref<HTMLDivElement>) => {
    const { width } = useWindowSize();

    return (
      <>
        <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
          <div ref={ref}>
            <PostShimmer />
          </div>
        </FlexItem>
        <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
          <PostShimmer />
        </FlexItem>
        {width >= mediumScreen && (
          <>
            <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
              <PostShimmer />
            </FlexItem>
            <FlexItem isFlexAndCenter defaultSize={100} sm={50}>
              <PostShimmer />
            </FlexItem>
          </>
        )}
      </>
    );
  },
);

PostShimmerComponent.displayName = 'PostShimmerComponent';

export const Posts = (): JSX.Element => {
  const dispatch = useDispatch();
  const { socketInterest } = useContext(SocketIoContext);
  const { setPopupType, setShowModal } = useContext(RootContext) as RootContextProps;
  const shimmerRef = useRef<HTMLDivElement | null>(null);

  const { books, loading, page, hasMorePages } = useSelector(
    (store: RootState) => store.books,
  );

  const { name: userName, userLon, userLat } = useSelector(
    (store: RootState) => store.user,
  );

  const handleAdditionalBookFetch = useCallback(() => {
    if (process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest(userLon, userLat, page + 1));
    }
  }, [books, userLon, userLat, page]);

  useOnScreen(shimmerRef, undefined, books, handleAdditionalBookFetch, true);

  const { accessToken, userId } = useSelector((s: RootState) => s.auth);
  useEffect(() => {
    if (process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest(userLon, userLat, 1));
    }
  }, [userLon, userLat]);

  const isSignedIn = Boolean(accessToken);

  const handleUnsignedInterest = () => {
    setShowModal(true);
    setPopupType('requireLoginOrSignup');
  };

  let posts;
  if (books) {
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
      {loading && books.length === 0 && <PostShimmerComponent />}
      {books.length > 0 && (
        <>
          {posts}
          {hasMorePages && <PostShimmerComponent ref={shimmerRef} />}
        </>
      )}
    </FlexContainer>
  );
};
