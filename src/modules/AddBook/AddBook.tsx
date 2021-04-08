import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'components/Input';
import * as Yup from 'yup';
import { Button } from 'ui-kits/Button';
import { FileInput } from 'components/FileInput';
import { RequestResult } from 'components/RequestResult';
import { AddAnotherButtonWrapper } from './AddBook.styles';

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

export interface AddBookProps {
  onSubmit: (bookValues: BookType, formikHelpers: FormikHelpers<BookType>) => void;
  successMsg: string | null;
  errMsg?: string | null;
  onAddAnother?: () => void;
}

export const AddBook = ({
  onSubmit,
  successMsg,
  errMsg,
  onAddAnother,
}: AddBookProps): JSX.Element => {
  return (
    <>
      {successMsg && (
        <>
          <RequestResult msg={successMsg} reqStatus="success" />
          <AddAnotherButtonWrapper>
            <Button onClick={onAddAnother}>Add Another Book</Button>
          </AddAnotherButtonWrapper>
        </>
      )}
      {errMsg && <RequestResult msg={errMsg} reqStatus="error" />}
      {!successMsg && !errMsg && (
        <Formik
          initialValues={{
            bookname: '',
            bookauthor: '',
            bookimage: null as BookType['bookimage'],
          }}
          validationSchema={Yup.object({
            bookname: Yup.string().required('Required field.'),
            bookauthor: Yup.string().required('Required field.'),
            bookimage: Yup.mixed()
              .required('An image of the book is required')
              .test('fileSize', 'File must be below 5mb', value => {
                return value && value.size <= 5 * 1024 * 1024;
              })
              .test('fileType', 'File must be either JPG or PNG', value => {
                return value && ['image/png', 'image/jpeg'].includes(value.type);
              }),
          })}
          onSubmit={onSubmit}
        >
          <Form>
            <Input
              type="text"
              labelText="Book you want to swap:"
              name="bookname"
              labelAtTop
              inputFieldFullWidth
              autoFocus
              trimWhiteSpaceOnBlur
            />
            <Input
              type="text"
              labelText="Author of the book:"
              name="bookauthor"
              labelAtTop
              inputFieldFullWidth
              trimWhiteSpaceOnBlur
            />
            <FileInput name="bookimage" labelText="Pick a picture:" />
            <Button color="blue" type="submit" asButtonTag>
              Add
            </Button>
          </Form>
        </Formik>
      )}
    </>
  );
};
