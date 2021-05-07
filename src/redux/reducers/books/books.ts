import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import {
  FETCH_BOOKS_START,
  FETCH_BOOKS_SUCCESS,
  FETCH_MORE_BOOKS_SUCCESS,
  FETCH_BOOKS_RESET,
  FETCH_BOOKS_FAIL,
  ADD_A_BOOK_START,
  ADD_A_BOOK_SUCCESS,
  ADD_A_BOOK_FAIL,
  ADD_A_BOOK_REFRESH,
  EXPRESS_INTEREST_START,
  EXPRESS_INTEREST_SUCCESS,
  EXPRESS_INTEREST_FAIL,
  MAKE_UNAVAILABLE_START,
  MAKE_UNAVAILABLE_SUCCESS,
  MAKE_UNAVAILABLE_FAIL,
  AVAILABLE_TEN_MORE_DAYS_START,
  AVAILABLE_TEN_MORE_DAYS_SUCCESS,
  AVAILABLE_TEN_MORE_DAYS_FAIL,
  AVAILABLE_TEN_MORE_DAYS_REFRESH,
  EDIT_BOOK_SET,
  EDIT_BOOK_START,
  EDIT_BOOK_SUCCESS,
  EDIT_BOOK_FAIL,
  EDIT_BOOK_REFRESH,
  FETCH_MATCHES_FOR_A_BOOK_SET,
  FETCH_MATCHES_FOR_A_BOOK_START,
  FETCH_MATCHES_FOR_A_BOOK_SUCCESS,
  FETCH_MATCHES_FOR_A_BOOK_FAIL,
  FETCH_MATCHES_FOR_A_BOOK_RESET,
  FETCH_MATCHED_BOOKS_START,
  FETCH_MATCHED_BOOKS_SUCCESS,
  FETCH_MATCHED_BOOKS_FAIL,
  FETCH_MATCHED_BOOKS_RESET,
  SENDING_SWAP_REQUEST_START,
  SENDING_SWAP_REQUEST_SUCCESS,
  SENDING_SWAP_REQUEST_FAIL,
  SENDING_SWAP_REQUEST_RESET,
  SWAP_CONSENT_REQUEST_START,
  SWAP_CONSENT_REQUEST_SUCCESS,
  SWAP_CONSENT_REQUEST_FAIL,
} from '../../actions/actionTypes';

export interface BookShape {
  bookId: string;
  bookName: string;
  bookAuthor: string;
  bookPicturePath: string;
  bookOwnerId: string;
  bookOwnerName: string;
  userIsInterested: boolean;
  reqOnGoing: boolean;
  reqError: string | null | Error;
  validTill: string;
  availableTenMoreDaysReqOnGoing: boolean;
  availableTenMoreDaysSuccessMsg: string | null;
  availableTenMoreDaysErr: { message: string; status: number } | null;
  swapRequested: boolean;
}

export interface BooksState {
  books: BookShape[];
  error: string | null | Error;
  loading: boolean;
  page: number;
  hasMorePages: boolean;
  addBookReqOnGoing: boolean;
  addBookReqSuccessMsg: string | null;
  addBookReqErr: { message: string; status: number } | null;
  editBookId: string | null;
  editBookReqOnGoing: boolean;
  editBookSuccessMsg: string | null;
  editBookErr: { message: string; status: number } | null;
  fetchMatchesForBookId: string | null;
  fetchMatchesForBookReqOnGoing: boolean;
  fetchMatchesForBookErr: { message: string; status: number } | null;
  matchesForBook: { name: string; userId: string }[] | null;
  pendingSwapRequestTo: { name: string; bookName: string; matchId: string } | null;
  pendingSwapRequestFrom: {
    name: string;
    bookName: string;
    notificationId: string;
    matchId: string;
  } | null;
  fetchBooksOfTheMatchId: string | null;
  fetchBooksOfTheMatchReqOnGoing: boolean;
  fetchBooksOfTheMatchErr: { message: string; status: number } | null;
  booksOfTheMatch:
    | {
        bookName: string;
        bookId: string;
        bookAuthor: string;
        bookPicturePath: string;
      }[]
    | null;
  sendingSwapReqOnGoing: boolean;
  sendingSwapReqSuccessMsg: string | null;
  sendingSwapReqErr: { message: string; status: number } | null;
  swapConsentReqOnGoing: boolean;
  swapConsentApproved: boolean | null;
  errorForSwapConsent: { message: string; status: number } | null;
  swapConsentForBookId: string | null;
}

export const initialState: BooksState = {
  // todo need to check what kind of json is returned, (possibly array)
  books: [],
  error: null,
  loading: false,
  page: 0,
  hasMorePages: true,
  addBookReqOnGoing: false,
  addBookReqSuccessMsg: null,
  addBookReqErr: null,
  editBookId: null,
  editBookReqOnGoing: false,
  editBookSuccessMsg: null,
  editBookErr: null,
  fetchMatchesForBookId: null,
  fetchMatchesForBookReqOnGoing: false,
  matchesForBook: null,
  pendingSwapRequestTo: null,
  pendingSwapRequestFrom: null,
  fetchMatchesForBookErr: null,
  fetchBooksOfTheMatchId: null,
  fetchBooksOfTheMatchReqOnGoing: false,
  fetchBooksOfTheMatchErr: null,
  booksOfTheMatch: null,
  sendingSwapReqOnGoing: false,
  sendingSwapReqSuccessMsg: null,
  sendingSwapReqErr: null,
  swapConsentReqOnGoing: false,
  swapConsentForBookId: null,
  swapConsentApproved: null,
  errorForSwapConsent: null,
};

// todo write tests for expressInterest related functions
const reducer = (state = initialState, action: AnyAction) => {
  const {
    books,
    error,
    interestActivity,
    page,
    hasMorePages,
    unavilableBookId,
    unavilableErr,
    addBookReqSuccessMsg,
    addBookReqErr,
    availableTenDaysBookId,
    availableTenDaysExpiry,
    availableTenMoreDaysSuccessMsg,
    availableTenMoreDaysErr,
    editBookId,
    editBookSuccessMsg,
    editBookErr,
    editedBook,
    fetchMatchesForBookId,
    matchesForBook,
    pendingSwapRequestTo,
    pendingSwapRequestFrom,
    statusOfSwapConsent,
    errorForSwapConsent,
    fetchMatchesForBookErr,
    fetchBooksOfTheMatchId,
    fetchBooksOfTheMatchErr,
    booksOfTheMatch,
    sendingSwapReqSuccessMsg,
    sendingSwapReqErr,
    swapConsentForBookId,
  } = action;

  switch (action.type) {
    case HYDRATE:
      // our action do not return a property named payload
      return { ...state };

    case FETCH_BOOKS_START:
      return { ...state, loading: true };

    case FETCH_BOOKS_SUCCESS:
      return { ...state, loading: false, books, page, hasMorePages };

    case FETCH_MORE_BOOKS_SUCCESS:
      const prevBooks = state.books;
      const newBooks = [...prevBooks, ...books];
      return { ...state, loading: false, books: newBooks, page, hasMorePages };

    case FETCH_BOOKS_FAIL:
      return { ...state, loading: false, error };

    case FETCH_BOOKS_RESET: {
      return { ...state, loading: false, error: null, books: [], page: 0 };
    }

    case ADD_A_BOOK_START:
      return { ...state, addBookReqOnGoing: true };

    case ADD_A_BOOK_SUCCESS:
      return { ...state, addBookReqOnGoing: false, addBookReqSuccessMsg };

    case ADD_A_BOOK_FAIL:
      return { ...state, addBookReqOnGoing: false, addBookReqErr };

    case ADD_A_BOOK_REFRESH:
      return {
        ...state,
        addBookReqOnGoing: false,
        addBookReqErr: null,
        addBookReqSuccessMsg: null,
      };

    case EXPRESS_INTEREST_START:
      const allBooks = [...state.books];
      const interestStartedOn = allBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestStartedOn !== undefined) {
        interestStartedOn.reqOnGoing = true;
      }
      return { ...state, books: allBooks };

    case EXPRESS_INTEREST_SUCCESS:
      const existingBooks = [...state.books];
      const interestSucceedOn = existingBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestSucceedOn !== undefined) {
        interestSucceedOn.userIsInterested = interestActivity.isInterested;
        interestSucceedOn.reqOnGoing = false;
      }
      return { ...state, books: existingBooks };

    case EXPRESS_INTEREST_FAIL:
      const currentBooks = [...state.books];
      const interestFailedOn = currentBooks.find(
        el => el.bookId === interestActivity.bookId,
      );
      if (interestFailedOn !== undefined) {
        interestFailedOn.reqOnGoing = false;
        interestFailedOn.reqError = interestActivity.err;
      }
      return { ...state, books: currentBooks };

    case MAKE_UNAVAILABLE_START: {
      const { books } = state;
      const currentBooks = [...books];
      const bookMakingUnavailable = currentBooks.find(
        book => book.bookId === unavilableBookId,
      );
      if (bookMakingUnavailable) {
        bookMakingUnavailable.reqOnGoing = true;
      }
      return { ...state, books: currentBooks };
    }

    case MAKE_UNAVAILABLE_SUCCESS: {
      const { books } = state;
      const currentBooks = [...books];
      const newBooks = currentBooks.filter(book => book.bookId !== unavilableBookId);
      return { ...state, books: newBooks };
    }

    case MAKE_UNAVAILABLE_FAIL: {
      const { books } = state;
      const currentBooks = [...books];
      const bookMakingUnavailable = currentBooks.find(
        book => book.bookId === unavilableBookId,
      );
      if (bookMakingUnavailable) {
        bookMakingUnavailable.reqOnGoing = false;
        bookMakingUnavailable.reqError = unavilableErr;
      }
      return { ...state, books: currentBooks };
    }

    case AVAILABLE_TEN_MORE_DAYS_START: {
      const { books } = state;
      const newBooks = books.map(book => {
        if (book.bookId === availableTenDaysBookId) {
          return { ...book, availableTenMoreDaysReqOnGoing: true };
        }
        return book;
      });
      return { ...state, books: newBooks };
    }

    case AVAILABLE_TEN_MORE_DAYS_SUCCESS: {
      const { books } = state;
      const newBooks = books.map(book => {
        if (book.bookId === availableTenDaysBookId) {
          return {
            ...book,
            validTill: availableTenDaysExpiry,
            availableTenMoreDaysReqOnGoing: false,
            availableTenMoreDaysSuccessMsg,
          };
        }
        return book;
      });
      return { ...state, books: newBooks };
    }

    case AVAILABLE_TEN_MORE_DAYS_FAIL: {
      const { books } = state;
      const newBooks = books.map(book => {
        if (book.bookId === availableTenDaysBookId) {
          return {
            ...book,
            availableTenMoreDaysReqOnGoing: false,
            availableTenMoreDaysErr,
          };
        }
        return book;
      });
      return { ...state, books: newBooks };
    }

    case AVAILABLE_TEN_MORE_DAYS_REFRESH: {
      const { books } = state;
      const newBooks = books.map(book => {
        if (book.bookId === availableTenDaysBookId) {
          return {
            ...book,
            availableTenMoreDaysReqOnGoing: false,
            availableTenMoreDaysSuccessMsg: null,
            availableTenMoreDaysErr: null,
          };
        }
        return book;
      });
      return { ...state, books: newBooks };
    }

    case EDIT_BOOK_SET: {
      return { ...state, editBookId };
    }

    case EDIT_BOOK_START: {
      return { ...state, editBookReqOnGoing: true };
    }

    case EDIT_BOOK_SUCCESS: {
      const { books } = state;
      const newBooks = books.map(book => {
        if (book.bookId === editBookId) {
          return editedBook;
        }
        return book;
      });

      return {
        ...state,
        books: newBooks,
        editBookReqOnGoing: false,
        editBookSuccessMsg,
      };
    }

    case EDIT_BOOK_FAIL: {
      return { ...state, editBookReqOnGoing: false, editBookErr };
    }

    case EDIT_BOOK_REFRESH: {
      return {
        ...state,
        editBookReqOnGoing: false,
        editBookId: null,
        editBookSuccessMsg: null,
        editBookErr: null,
      };
    }

    case FETCH_MATCHES_FOR_A_BOOK_SET: {
      return { ...state, fetchMatchesForBookId };
    }

    case FETCH_MATCHES_FOR_A_BOOK_START: {
      return { ...state, fetchMatchesForBookReqOnGoing: true };
    }

    case FETCH_MATCHES_FOR_A_BOOK_SUCCESS: {
      return {
        ...state,
        fetchMatchesForBookReqOnGoing: false,
        matchesForBook,
        pendingSwapRequestTo,
        pendingSwapRequestFrom,
      };
    }

    case FETCH_MATCHES_FOR_A_BOOK_FAIL: {
      return {
        ...state,
        fetchMatchesForBookReqOnGoing: false,
        fetchMatchesForBookErr,
      };
    }

    case FETCH_MATCHES_FOR_A_BOOK_RESET: {
      return {
        ...state,
        fetchMatchesForBookId: null,
        fetchMatchesForBookReqOnGoing: false,
        matchesForBook: null,
        pendingSwapRequestTo: null,
        pendingSwapRequestFrom: null,
        fetchMatchesForBookErr: null,
        swapConsentReqOnGoing: false,
        swapConsentForBookId: null,
        swapConsentApproved: null,
        errorForSwapConsent: null,
      };
    }

    case FETCH_MATCHED_BOOKS_START: {
      return {
        ...state,
        fetchBooksOfTheMatchReqOnGoing: true,
        fetchBooksOfTheMatchId,
      };
    }

    case FETCH_MATCHED_BOOKS_SUCCESS: {
      return {
        ...state,
        fetchBooksOfTheMatchReqOnGoing: false,
        booksOfTheMatch,
      };
    }

    case FETCH_MATCHED_BOOKS_FAIL: {
      return {
        ...state,
        fetchBooksOfTheMatchReqOnGoing: false,
        fetchBooksOfTheMatchErr,
      };
    }

    case FETCH_MATCHED_BOOKS_RESET: {
      return {
        ...state,
        fetchBooksOfTheMatchReqOnGoing: false,
        fetchBooksOfTheMatchErr: null,
        fetchBooksOfTheMatchId: null,
        booksOfTheMatch: null,
      };
    }

    case SENDING_SWAP_REQUEST_START: {
      return {
        ...state,
        sendingSwapReqOnGoing: true,
      };
    }

    case SENDING_SWAP_REQUEST_SUCCESS: {
      return {
        ...state,
        sendingSwapReqOnGoing: false,
        sendingSwapReqSuccessMsg,
      };
    }

    case SENDING_SWAP_REQUEST_FAIL: {
      return {
        ...state,
        sendingSwapReqOnGoing: false,
        sendingSwapReqErr,
      };
    }

    case SENDING_SWAP_REQUEST_RESET: {
      return {
        ...state,
        sendingSwapReqOnGoing: false,
        sendingSwapReqSuccessMsg: null,
        sendingSwapReqErr: null,
      };
    }

    case SWAP_CONSENT_REQUEST_START: {
      return {
        ...state,
        swapConsentReqOnGoing: true,
        swapConsentForBookId,
      };
    }

    case SWAP_CONSENT_REQUEST_SUCCESS: {
      let swapUpdate;
      if (statusOfSwapConsent === 'approved') {
        swapUpdate = {
          matchesForBook: [],
          swapConsentApproved: true,
        };
      } else {
        swapUpdate = {
          swapConsentApproved: false,
        };
      }
      return {
        ...state,
        swapConsentReqOnGoing: false,
        ...swapUpdate,
      };
    }

    case SWAP_CONSENT_REQUEST_FAIL: {
      return {
        ...state,
        swapConsentReqOnGoing: false,
        errorForSwapConsent,
      };
    }

    default:
      return state;
  }
};

export default reducer;
