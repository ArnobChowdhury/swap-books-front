import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ErrorMessage,
  MatchContainer,
  Name,
  BooksListContainer,
  NameContainer,
  BooksListUl,
  BooksListLi,
  BooksListImage,
  NoMatchesFound,
  TopContainer,
  HeaderMatches,
  ListImageAndTitleContainer,
  MatchProfileLink,
  SwapConsentButtonContainer,
  PendingSwapWrapper,
  SwapReqStatus,
} from './SwapMatches.styles';
import { Modal } from 'components/Modal';
import { RootState } from 'redux/reducers';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { RequestResult } from 'components/RequestResult';
import { UserIcon } from 'ui-kits/UserIcon';
import { Paragraph } from 'ui-kits/Paragraph';
import { IconRotator } from 'ui-kits/IconRotator';
import { Header } from 'ui-kits/Header';
import { Spinner } from 'ui-kits/Spinner';
import { DownArrow } from 'assets/DownArrow';
import {
  fetchMatchesForBookReq,
  fetchBooksForMatchReq,
  fetchBooksForMatchReset,
  sendingSwapRequest,
} from 'redux/actions/book';
import { swapConsentRequest } from 'redux/actions/notifications';
import { LoaderBook } from 'assets/LoaderBook';
import theme from 'theme';
import { SocketIoContext } from 'hoc/Sockets';
import { Button } from 'ui-kits/Button';
import Link from 'next/link';
import { useWindowSize } from 'hooks';

export const SwapMatches = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    fetchMatchesForBookReqOnGoing,
    matchesForBook,
    pendingSwapRequestTo,
    pendingSwapRequestFrom,
    fetchMatchesForBookId,
    fetchMatchesForBookErr,
    booksOfTheMatch,
    fetchBooksOfTheMatchReqOnGoing,
    fetchBooksOfTheMatchId,
    fetchBooksOfTheMatchErr,
    sendingSwapReqOnGoing,
    sendingSwapReqSuccessMsg,
    sendingSwapReqErr,
    swapConsentReqOnGoing,
    swapConsentForBookId,
    swapConsentApproved,
    errorForSwapConsent,
  } = useSelector((s: RootState) => s.books);

  const { width } = useWindowSize();
  const { socketIo } = useContext(SocketIoContext);
  const { spaceFive } = theme;

  useEffect(() => {
    if (fetchMatchesForBookId) {
      dispatch(fetchMatchesForBookReq(fetchMatchesForBookId));
    }
  }, [fetchMatchesForBookId]);

  const rootContext = useContext(RootContext);
  const { setShowModal } = rootContext as RootContextProps;

  const handleMatchNameClick = (matchId: string) => {
    dispatch(fetchBooksForMatchReset());
    const shouldOpenAndDispatch = matchId !== fetchBooksOfTheMatchId;
    if (shouldOpenAndDispatch) {
      dispatch(fetchBooksForMatchReq(matchId));
    }
  };

  const handleBookSwapSelection = (bookId: string) => {
    // TODO DO WHATEVER WE HAVE TO DO FOR SENDING SWAP REQUEST
    if (fetchBooksOfTheMatchId) {
      if (socketIo && fetchMatchesForBookId) {
        dispatch(
          sendingSwapRequest(
            socketIo,
            fetchBooksOfTheMatchId,
            bookId,
            fetchMatchesForBookId,
          ),
        );
      }
    }
  };

  let swappables: JSX.Element[];
  const disableConfirmButton =
    Boolean(pendingSwapRequestTo) ||
    (Boolean(pendingSwapRequestFrom) && swapConsentApproved !== false);

  if (booksOfTheMatch) {
    swappables = booksOfTheMatch.map(
      ({ bookName, bookAuthor, bookId, bookPicturePath }) => (
        <BooksListLi key={bookId}>
          <ListImageAndTitleContainer>
            <BooksListImage src={`/${bookPicturePath}`}></BooksListImage>
            <Paragraph fontWeight="regular">
              <strong>{bookName}</strong> by {bookAuthor}
            </Paragraph>
          </ListImageAndTitleContainer>
          <Button
            lessPaddingOnLargeScreen
            asButtonTag
            onClick={() => handleBookSwapSelection(bookId)}
            disabled={disableConfirmButton}
          >
            Confirm
          </Button>
        </BooksListLi>
      ),
    );
  }

  let allmatches;
  if (matchesForBook) {
    allmatches = matchesForBook.map(({ name, userId: matchId }) => {
      const isSelected = matchId === fetchBooksOfTheMatchId;
      return (
        <MatchContainer key={matchId}>
          <NameContainer
            isSelected={isSelected}
            onClick={() => handleMatchNameClick(matchId)}
          >
            <Name>
              <UserIcon userName={name} />
              <Paragraph fontWeight="regular" fontSize="large">
                {name}
              </Paragraph>
            </Name>
            <IconRotator rotateOneEighty={isSelected}>
              <DownArrow />
            </IconRotator>
          </NameContainer>
          <BooksListContainer
            reqOnGoing={fetchBooksOfTheMatchReqOnGoing}
            show={isSelected}
          >
            {fetchBooksOfTheMatchReqOnGoing && isSelected && <Spinner />}
            {booksOfTheMatch && isSelected && (
              <>
                <Header marginBelow={spaceFive} headerFontSize={14}>
                  Books:
                </Header>
                <BooksListUl>{swappables}</BooksListUl>
              </>
            )}
            {fetchBooksOfTheMatchErr && isSelected && (
              <ErrorMessage>{fetchBooksOfTheMatchErr.message}</ErrorMessage>
            )}
          </BooksListContainer>
        </MatchContainer>
      );
    });
  }

  const handleSwapApproval = (hasAccepted: boolean, notificationId: string) => {
    if (socketIo && fetchMatchesForBookId)
      dispatch(
        swapConsentRequest(
          socketIo,
          notificationId,
          fetchMatchesForBookId,
          hasAccepted,
        ),
      );
  };

  const showError =
    sendingSwapReqErr || fetchMatchesForBookErr || errorForSwapConsent;
  const errorMessage = showError && showError.message;

  const swapApprovalOnGoing =
    swapConsentReqOnGoing && fetchMatchesForBookId === swapConsentForBookId;
  const showSuccessMessage =
    Boolean(sendingSwapReqSuccessMsg) || swapConsentApproved;
  const successMessage = swapConsentApproved
    ? `Swap confirmed with ${pendingSwapRequestFrom?.name}'s book - ${pendingSwapRequestFrom?.bookName}.`
    : sendingSwapReqSuccessMsg
    ? sendingSwapReqSuccessMsg
    : '';

  return (
    <Modal currentWidth={width} onClick={() => setShowModal(false)}>
      {(fetchMatchesForBookReqOnGoing || sendingSwapReqOnGoing) && (
        <LoaderBook
          text={
            fetchMatchesForBookReqOnGoing
              ? 'Fetching matches'
              : 'Sending swap request'
          }
        />
      )}
      {!fetchMatchesForBookReqOnGoing &&
        !showError &&
        matchesForBook &&
        !sendingSwapReqSuccessMsg &&
        !sendingSwapReqOnGoing &&
        swapConsentApproved !== true &&
        (matchesForBook.length > 0 ? (
          <>
            {(pendingSwapRequestTo || pendingSwapRequestFrom) && (
              <PendingSwapWrapper>
                {pendingSwapRequestTo && (
                  <Paragraph fontWeight="regular" fontSize="large">
                    You have confirmed that this book was swapped with{' '}
                    <Link href={`/user/${pendingSwapRequestTo.matchId}`} passHref>
                      <MatchProfileLink>
                        {pendingSwapRequestTo.name}
                      </MatchProfileLink>
                    </Link>
                    's book - <i>{pendingSwapRequestTo.bookName}</i>.{' '}
                    <Link href={`/user/${pendingSwapRequestTo.matchId}`} passHref>
                      <MatchProfileLink>
                        {pendingSwapRequestTo.name}
                      </MatchProfileLink>
                    </Link>{' '}
                    is yet to confirm.
                  </Paragraph>
                )}
                {pendingSwapRequestFrom && (
                  <>
                    <Paragraph fontWeight="regular" fontSize="large">
                      <Link
                        href={`/user/${pendingSwapRequestFrom.matchId}`}
                        passHref
                      >
                        <MatchProfileLink>
                          {pendingSwapRequestFrom.name}
                        </MatchProfileLink>
                      </Link>{' '}
                      has claimed that this book was swapped with -{' '}
                      <Link
                        href={`/user/${pendingSwapRequestFrom.matchId}`}
                        passHref
                      >
                        <MatchProfileLink>
                          {pendingSwapRequestFrom.name}
                        </MatchProfileLink>
                      </Link>
                      's book -<i>{pendingSwapRequestFrom.bookName}</i>. Do you
                      accept?
                    </Paragraph>
                    <SwapConsentButtonContainer>
                      {swapConsentApproved === null && (
                        <>
                          <Button
                            lessPaddingOnLargeScreen
                            asButtonTag
                            onClick={() =>
                              handleSwapApproval(
                                true,
                                pendingSwapRequestFrom.notificationId,
                              )
                            }
                            disabled={swapApprovalOnGoing}
                          >
                            Yes
                          </Button>
                          <Button
                            lessPaddingOnLargeScreen
                            asButtonTag
                            color="alert"
                            onClick={() =>
                              handleSwapApproval(
                                false,
                                pendingSwapRequestFrom.notificationId,
                              )
                            }
                            disabled={swapApprovalOnGoing}
                          >
                            No
                          </Button>
                        </>
                      )}
                      {swapConsentApproved === false && (
                        <SwapReqStatus>- Swap request rejected</SwapReqStatus>
                      )}
                    </SwapConsentButtonContainer>
                  </>
                )}
              </PendingSwapWrapper>
            )}
            <TopContainer>
              <HeaderMatches>Matches:</HeaderMatches>
              {!pendingSwapRequestTo && !pendingSwapRequestFrom && (
                <Paragraph fontWeight="regular" fontSize="large">
                  Swapped books with any of these matches? Please confirm.
                </Paragraph>
              )}
            </TopContainer>
            {allmatches}
          </>
        ) : (
          <NoMatchesFound>No matches found for this book!</NoMatchesFound>
        ))}
      {showSuccessMessage && (
        <RequestResult msg={successMessage} reqStatus="success" />
      )}
      {!fetchMatchesForBookReqOnGoing && !sendingSwapReqOnGoing && showError && (
        <RequestResult msg={errorMessage as string} reqStatus="error" />
      )}
    </Modal>
  );
};
