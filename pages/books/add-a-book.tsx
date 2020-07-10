import { useState } from 'react';
import { NextPage } from 'next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { NavBar } from 'components/NavBar';
import { PageLayout } from 'hoc/PageLayout';
import { FlexContainer } from 'components/FlexContainer';
import { FlexItem } from 'components/FlexItem';
import { Input } from 'components/Input';
import { FileInput } from 'components/FileInput';
import { Button } from 'components/Button';
import { useDispatch } from 'react-redux';
// todo all actions should be in an index.tsx
import { addABookRequest } from 'redux/actions/book';

const AddABook: NextPage = (): JSX.Element => {
  // todo we will need to change the userName when we are able to add user data
  const dispatch = useDispatch();
  const [files, setFiles] = useState();
  const handleFileClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    setFiles(e.target.files?.[0]);
  };

  return (
    <>
      <NavBar userName="arnob" />
      <PageLayout>
        <FlexContainer>
          <FlexItem defaultSize={35}>
            <div
              style={{
                width: '50%',
                height: '50%',
                border: '1px solid orange',
                background: 'limegreen',
              }}
            >
              I am an image
            </div>
          </FlexItem>
          <FlexItem defaultSize={65}>
            <Formik
              initialValues={{
                bookname: '',
                bookauthor: '',
              }}
              validationSchema={Yup.object({
                bookname: Yup.string().required('Required'),
                bookauthor: Yup.string().required('Required'),
              })}
              onSubmit={({ bookname, bookauthor }, { setSubmitting }) => {
                dispatch(
                  addABookRequest(bookname, bookauthor, files, setSubmitting),
                );
              }}
            >
              <Form>
                <Input
                  type="text"
                  labelText="Book you want to swap:"
                  name="bookname"
                  labelAtTop
                />
                <Input
                  type="text"
                  labelText="Author of the book:"
                  name="bookauthor"
                  labelAtTop
                />
                <FileInput
                  name="bookpicture"
                  labelText="Pick a picture"
                  onChange={e => handleFileClick(e)}
                />
                <Button color="dark" type="submit" fontMedium asButtonTag>
                  Add
                </Button>
              </Form>
            </Formik>
          </FlexItem>
        </FlexContainer>
      </PageLayout>
    </>
  );
};

export default AddABook;
