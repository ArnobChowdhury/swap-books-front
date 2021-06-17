import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'components/Input';
import * as Yup from 'yup';
import { Button } from 'ui-kits/Button';
import { FileInput } from 'components/FileInput';
import { RequestResult } from 'components/RequestResult';
import { AddAnotherButtonWrapper } from './AddBook.styles';
import { BadInput } from 'ui-kits/BadInput';

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
  nsfwImg?: boolean;
  refreshNsfwFlag?: () => void;
  onAddAnother?: () => void;
}

export const AddBook = ({
  onSubmit,
  successMsg,
  errMsg,
  onAddAnother,
  nsfwImg = false,
  refreshNsfwFlag,
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
        <>
          {nsfwImg && (
            <BadInput>
              Sorry! This image was flagged as NSFW. Please try uploading a different
              image of the book.
            </BadInput>
          )}
          <Formik
            validateOnBlur
            initialValues={{
              bookname: '',
              bookauthor: '',
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
                .required('An image of the book is required')
                .test('fileType', 'File must be either JPG or PNG', value => {
                  return value && ['image/png', 'image/jpeg'].includes(value.type);
                })
                .test('fileSize', 'File must be below 5mb', value => {
                  return value && value.size <= 5 * 1024 * 1024;
                }),
            })}
            onSubmit={onSubmit}
          >
            <Form>
              <FileInput
                autoFocus
                name="bookimage"
                labelText="Click/Tap to pick an image"
                executeOnChange={nsfwImg ? refreshNsfwFlag : undefined}
              />
              <Input
                type="text"
                labelText="Book name:"
                name="bookname"
                labelAtTop
                inputFieldFullWidth
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
                Add
              </Button>
            </Form>
          </Formik>
        </>
      )}
    </>
  );
};
