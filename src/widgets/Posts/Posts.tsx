import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooksRequest,
  expressInterestStart,
  makeUnavailableRequest,
  booksResetToNil,
  availableTenMoreDaysReq,
  editBookSetId,
  editBookRefresh,
  fetchMatchesForBookSetId,
  fetchMatchesForBookReset,
  fetchBooksForMatchReset,
  sendingSwapRequestReset,
} from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { Post, PostShimmer } from 'modules/Post';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { useOnScreen, useWindowSize } from 'hooks';
import { useRouter } from 'next/router';
import { CenterContainer } from 'ui-kits/CenterContainer';
import { RequestResult } from 'components/RequestResult';

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
  selectedTab?: 'Available to Swap' | 'Swap Request Pending';
}

export const Posts = ({ profileId, selectedTab }: PostProps): JSX.Element => {
  const dispatch = useDispatch();
  const { socketIo } = useContext(SocketIoContext);
  const { setPopupType, setShowModal } = useContext(RootContext) as RootContextProps;
  const shimmerRef = useRef<HTMLDivElement | null>(null);
  const { asPath } = useRouter();

  const { books, loading, page, hasMorePages } = useSelector(
    (store: RootState) => store.books,
  );

  const { name: userName, userLon, userLat, booksAvailableToSwap } = useSelector(
    (store: RootState) => store.user,
  );
  const { accessToken, userId } = useSelector((s: RootState) => s.auth);

  const isUsersProfile = asPath === `/user/${userId}`;

  const handleAdditionalBookFetchForHome = useCallback(() => {
    if (process.browser && userLon && userLat) {
      dispatch(
        fetchBooksRequest({ location: { userLon, userLat }, page: page + 1 }),
      );
    }
  }, [books, userLon, userLat, page]);

  const handleAdditionalBookFetchForProfile = useCallback(() => {
    if (process.browser && profileId) {
      dispatch(fetchBooksRequest({ profileId, page: page + 1 }));
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

  useEffect(() => {
    if (!profileId && process.browser && userLon && userLat) {
      dispatch(fetchBooksRequest({ location: { userLon, userLat }, page: 1 }));
    } else {
      dispatch(booksResetToNil());
    }
  }, [userLon, userLat, profileId]);

  useEffect(() => {
    if (profileId) {
      dispatch(fetchBooksRequest({ profileId, page: 1 }));
    }
  }, [profileId]);

  const isSignedIn = Boolean(accessToken);

  const handleUnsignedInterest = () => {
    setShowModal(true);
    setPopupType('requireLoginOrSignup');
  };

  let booksFiltered = books;
  if (profileId && profileId === userId && selectedTab) {
    if (selectedTab === 'Available to Swap') {
      booksFiltered = books.filter(book => !book.swapRequested);
    }
    if (selectedTab === 'Swap Request Pending') {
      booksFiltered = books.filter(book => book.swapRequested);
    }
  }

  let posts;
  if (books) {
    posts = booksFiltered.map(el => {
      const {
        bookId,
        bookName,
        bookAuthor,
        bookPicturePath,
        bookOwnerName,
        bookOwnerId,
        userIsInterested,
        reqOnGoing,
        validTill,
        availableTenMoreDaysReqOnGoing,
        availableTenMoreDaysSuccessMsg,
        availableTenMoreDaysErr,
      } = el;

      // todo if the expressing interest network activity goes wrong what do we do???
      const isOwners = bookOwnerId === userId;
      return (
        <Post
          bookName={bookName}
          bookAuthor={bookAuthor}
          bookOwnerName={bookOwnerName}
          imgUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${bookPicturePath}`}
          onPostButtonClick={() => {
            if (!isOwners) {
              if (
                isSignedIn &&
                socketIo !== undefined &&
                userName &&
                booksAvailableToSwap > 0
              ) {
                dispatch(
                  expressInterestStart(
                    socketIo,
                    bookId,
                    bookOwnerId,
                    !userIsInterested,
                  ),
                );
              } else {
                handleUnsignedInterest();
              }
            } else {
              // TODO Since we are doing all the reset here we can just have one reset for the whole post swap related states
              dispatch(fetchMatchesForBookReset());
              dispatch(sendingSwapRequestReset());
              dispatch(fetchBooksForMatchReset());
              dispatch(fetchMatchesForBookSetId(bookId));
              setShowModal(true);
              setPopupType('swapBook');
            }
          }}
          isInterested={userIsInterested}
          topMargin
          reqOnGoing={reqOnGoing}
          isOwners={isOwners}
          key={bookId}
          isUsersProfile={isUsersProfile}
          validTill={validTill}
          onAvailableButtonClick={() => {
            dispatch(availableTenMoreDaysReq(bookId));
          }}
          onEditButtonClick={() => {
            setPopupType('editBook');
            setShowModal(true);
            dispatch(editBookRefresh());
            dispatch(editBookSetId(bookId));
          }}
          onDeleteButtonClick={() => {
            if (isSignedIn) {
              dispatch(makeUnavailableRequest(bookId));
              // DO WE REALLY NEED handleUnsignedInterest ??? Probably not. Harold Investigate
            } else {
              handleUnsignedInterest();
            }
          }}
          availableTenMoreDaysReqOnGoing={availableTenMoreDaysReqOnGoing}
          availableTenMoreDaysSuccessMsg={availableTenMoreDaysSuccessMsg}
          availableTenMoreDaysErr={availableTenMoreDaysErr}
        />
      );
    });
  }
  // TODO is PageLayout a HOC? I don't think it is anymore
  const showShimmer = loading && books.length === 0;
  const showBooks = books.length > 0;
  const showPickLocation = !profileId && !userLon && !userLat;
  const showNoBooksAtThisLocation =
    !profileId && !loading && userLat && userLon && !showBooks;

  return (
    <>
      {showShimmer && <PostShimmerComponent />}
      {showBooks && (
        <>
          {posts}
          {hasMorePages && <PostShimmerComponent ref={shimmerRef} />}
        </>
      )}
      {showPickLocation && (
        <CenterContainer>
          <RequestResult
            msg="You need to pick a location to see available books."
            reqStatus="needLocation"
          ></RequestResult>
        </CenterContainer>
      )}
      {showNoBooksAtThisLocation && (
        <CenterContainer>
          <RequestResult
            msg="Sorry, No books are available to be swapped at your chosen location. Try changing your location or add a book."
            reqStatus="noBooks"
          ></RequestResult>
        </CenterContainer>
      )}
    </>
  );
};
