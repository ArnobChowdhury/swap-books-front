import { useContext } from 'react';
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

  return (
    <Modal
      onClick={() => setShowModal(false)}
      formSubmitting={editBookReqOnGoing} // editBookReqOnGoing
    >
      {editBookSuccessMsg && (
        <RequestResult msg={editBookSuccessMsg} reqStatus="success" />
      )}
      {editBookErr && <RequestResult msg={editBookErr.message} reqStatus="error" />}
      {!editBookSuccessMsg && !editBookErr && (
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
              .test('fileSize', 'File must be below 5mb', value => {
                if (value) {
                  return value.size <= 5 * 1024 * 1024;
                }
                return true;
              })
              .test('fileType', 'File must be either JPG or PNG', value => {
                if (value) {
                  return ['image/png', 'image/jpeg'].includes(value.type);
                }
                return true;
              }),
          })}
          onSubmit={handleEditBookSubmit}
        >
          <Form>
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
            <FileInput name="bookimage" labelText="Pick a picture:" />
            <Button color="blue" type="submit" asButtonTag>
              Save
            </Button>
          </Form>
        </Formik>
      )}
    </Modal>
  );
};
