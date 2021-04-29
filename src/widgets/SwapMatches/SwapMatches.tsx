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
  HeaderList,
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
import { LoaderBook } from 'assets/LoaderBook';
import theme from 'theme';
import { SocketIoContext } from 'hoc/Sockets';

export const SwapMatches = (): JSX.Element => {
  const dispatch = useDispatch();
  const {
    fetchMatchesForBookReqOnGoing,
    matchesForBook,
    fetchMatchesForBookId,
    fetchMatchesForBookErr,
    booksOfTheMatch,
    fetchBooksOfTheMatchReqOnGoing,
    fetchBooksOfTheMatchId,
    fetchBooksOfTheMatchErr,
    sendingSwapReqOnGoing,
    sendingSwapReqSuccessMsg,
    sendingSwapReqErr,
  } = useSelector((s: RootState) => s.books);

  const { socketIo } = useContext(SocketIoContext);
  const { spaceFive, fontLarge } = theme;

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
  if (booksOfTheMatch) {
    swappables = booksOfTheMatch.map(
      ({ bookName, bookAuthor, bookId, bookPicturePath }) => (
        <BooksListLi key={bookId} onClick={() => handleBookSwapSelection(bookId)}>
          <BooksListImage src={`/${bookPicturePath}`}></BooksListImage>
          <Paragraph fontWeight="regular">
            <strong>{bookName}</strong> by {bookAuthor}
          </Paragraph>
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

  const showError = sendingSwapReqErr || fetchMatchesForBookErr;
  const errorMessage = showError && showError.message;

  return (
    <Modal onClick={() => setShowModal(false)}>
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
        !fetchMatchesForBookErr &&
        matchesForBook &&
        !sendingSwapReqSuccessMsg &&
        !sendingSwapReqErr &&
        !sendingSwapReqOnGoing &&
        (matchesForBook.length > 0 ? (
          <>
            <HeaderList>Swapped with:</HeaderList>
            {allmatches}
          </>
        ) : (
          <NoMatchesFound>No matches found for this book!</NoMatchesFound>
        ))}
      {sendingSwapReqSuccessMsg && (
        <RequestResult msg={sendingSwapReqSuccessMsg} reqStatus="success" />
      )}
      {!fetchMatchesForBookReqOnGoing && !sendingSwapReqOnGoing && showError && (
        <RequestResult msg={errorMessage as string} reqStatus="error" />
      )}
    </Modal>
  );
};
