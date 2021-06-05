import axios from 'axiosInstance';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'components/Modal';
import { RootState } from 'redux/reducers';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'components/Input';
import * as Yup from 'yup';
import { Button } from 'ui-kits/Button';
import { FileInput } from 'components/FileInput';
import { RequestResult } from 'components/RequestResult';
import { editBookReq } from 'redux/actions/book';
import { LoaderBook } from 'assets/LoaderBook';
import { useWindowSize } from 'hooks';
export interface BookType {
  bookname: string;
  bookauthor: string;
  bookimage: {
    lastModified: number;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
  } | null;
}

export const EditBook = (): JSX.Element => {
  const { width } = useWindowSize();

  const [bookIsEditable, setBookIsEditable] = useState(false);
  const [checkingBookIsEditable, setCheckingBookIsEditable] = useState(true);
  const [bookIsEditableError, setBookIsEditableError] = useState<string>();

  useEffect(() => {
    const path = '/books/isEditable';
    const params = { bookId: editBookId };
    axios
      .get(path, { params })
      .then(res => {
        const { isEditable } = res.data;
        setBookIsEditable(isEditable);
        setCheckingBookIsEditable(false);
      })
      .catch(({ response }: AxiosError<{ message: string }>) => {
        setCheckingBookIsEditable(false);
        if (response) {
          const { status, data } = response;
          const { message } = data;
          if (status === 500) {
            setBookIsEditableError('Something went wrong!');
          } else {
            setBookIsEditableError(message);
          }
        }
      });
  }, []);

  const dispatch = useDispatch();
  const {
    editBookId,
    books,
    editBookSuccessMsg,
    editBookErr,
    editBookReqOnGoing,
  } = useSelector((s: RootState) => s.books);
  const bookToBeEdited = books.find(book => book.bookId === editBookId);

  let bookName = '';
  let bookAuthor = '';

  if (bookToBeEdited) {
    bookName = bookToBeEdited.bookName;
    bookAuthor = bookToBeEdited.bookAuthor;
  }

  const handleEditBookSubmit = (
    { bookname, bookauthor, bookimage }: BookType,
    { setSubmitting }: FormikHelpers<BookType>,
  ) => {
    if (editBookId) {
      dispatch(
        editBookReq(editBookId, bookname, bookauthor, bookimage, setSubmitting),
      );
    }
  };

  const rootContext = useContext(RootContext);
  const { setShowModal } = rootContext as RootContextProps;
  const bookIsNotEditable = !checkingBookIsEditable && !bookIsEditable;

  const showErrorMessage =
    Boolean(editBookErr) || (bookIsNotEditable && Boolean(bookIsEditableError));
  let errorMessage = '';
  if (showErrorMessage) {
    if (editBookErr) {
      errorMessage = editBookErr.message;
    }
    if (bookIsEditableError) {
      errorMessage = bookIsEditableError;
    }
  }

  return (
    <Modal
      currentWidth={width}
      onClick={() => setShowModal(false)}
      formSubmitting={editBookReqOnGoing} // editBookReqOnGoing
    >
      {editBookSuccessMsg && (
        <RequestResult msg={editBookSuccessMsg} reqStatus="success" />
      )}
      {showErrorMessage && <RequestResult msg={errorMessage} reqStatus="error" />}
      {checkingBookIsEditable && (
        <LoaderBook text="Checking if this post is editable" />
      )}
      {bookIsNotEditable && (
        <RequestResult
          msg="This post is not editable. This can be caused by one of two reasons. You
          have sent a swap request or someone sent a swap request for this book. If
          you have received a swap request for this book, please responsd."
          reqStatus="error"
        />
      )}
      {!editBookSuccessMsg &&
        !editBookErr &&
        bookIsEditable &&
        !checkingBookIsEditable && (
          <Formik
            initialValues={{
              bookname: bookName,
              bookauthor: bookAuthor,
              bookimage: null as BookType['bookimage'],
            }}
            validationSchema={Yup.object({
              bookname: Yup.string()
                .max(200, 'Book name cannot be longer than 200 characters.')
                .required('Required field.'),
              bookauthor: Yup.string()
                .max(200, 'Name of book authors cannot be more than 200 characters.')
                .required('Required field.'),
              bookimage: Yup.mixed()
                .test('fileType', 'File must be either JPG or PNG', value => {
                  if (value) {
                    return ['image/png', 'image/jpeg'].includes(value.type);
                  }
                  return true;
                })
                .test('fileSize', 'File must be below 5mb', value => {
                  if (value) {
                    return value.size <= 5 * 1024 * 1024;
                  }
                  return true;
                }),
            })}
            onSubmit={handleEditBookSubmit}
          >
            <Form>
              <FileInput
                autoFocus
                name="bookimage"
                labelText="Click/Tap to pick an image"
              />
              <Input
                type="text"
                labelText="Book name:"
                name="bookname"
                labelAtTop
                inputFieldFullWidth
                autoFocus
                trimWhiteSpaceOnBlur
              />
              <Input
                type="text"
                labelText="Author:"
                name="bookauthor"
                labelAtTop
                inputFieldFullWidth
                trimWhiteSpaceOnBlur
              />
              <Button color="blue" type="submit" asButtonTag>
                Save
              </Button>
            </Form>
          </Formik>
        )}
    </Modal>
  );
};
