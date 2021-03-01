import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooksRequest,
  fetchProfileBooksRequest,
  expressInterestStart,
} from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { Post, PostShimmer } from 'modules/Post';
import { FlexContainer } from 'ui-kits/FlexContainer';
import { FlexItem } from 'ui-kits/FlexItem';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { mediumScreen } from 'mediaConfig';
import { useOnScreen, useWindowSize } from 'hooks';
import profile from 'redux/reducers/profile';

const PostShimmerComponent = React.forwardRef(
  (_props, ref: React.Ref<HTMLDivElement>) => {
    const { width } = useWindowSize();

    return (
      <>
        <PostShimmer ref={ref} />
        <PostShimmer />
      </>
    );
  },
);

PostShimmerComponent.displayName = 'PostShimmerComponent';

interface PostProps {
  profileId?: string;
}

export const Posts = ({ profileId }: PostProps): JSX.Element => {
  const dispatch = useDispatch();
  const { socketIo } = useContext(SocketIoContext);
  const { setPopupType, setShowModal } = useContext(RootContext) as RootContextProps;
  const shimmerRef = useRef<HTMLDivElement | null>(null);

  const { books, loading, page, hasMorePages } = useSelector(
    (store: RootState) => store.books,
  );

  const { name: userName, userLon, userLat } = useSelector(
    (store: RootState) => store.user,
  );

  const handleAdditionalBookFetchForHome = useCallback(() => {
    if (process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest(userLon, userLat, page + 1));
    }
  }, [books, userLon, userLat, page]);

  const handleAdditionalBookFetchForProfile = useCallback(() => {
    if (process.browser && profileId) {
      dispatch(fetchProfileBooksRequest(profileId, page + 1));
    }
  }, [books, profileId, page]);

  useOnScreen(
    shimmerRef,
    undefined,
    books,
    profileId
      ? handleAdditionalBookFetchForProfile
      : handleAdditionalBookFetchForHome,
    true,
  );

  const { accessToken, userId } = useSelector((s: RootState) => s.auth);
  useEffect(() => {
    if (!profileId && process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest(userLon, userLat, 1));
    }
  }, [userLon, userLat, profileId]);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchProfileBooksRequest(profileId, 1));
    }
  }, [profileId]);

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
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          bookOwnerName={bookOwnerName}
          imgUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${bookPicturePath}`}
          onInterestButtonClick={() => {
            if (isSignedIn && socketIo !== undefined && userName) {
              dispatch(
                expressInterestStart(
                  socketIo,
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
      );
    });
  }
  // TODO is PageLayout a HOC? I don't think it is anymore
  return (
    <>
      {loading && books.length === 0 && <PostShimmerComponent />}
      {books.length > 0 && (
        <>
          {posts}
          {hasMorePages && <PostShimmerComponent ref={shimmerRef} />}
        </>
      )}
    </>
  );
};
