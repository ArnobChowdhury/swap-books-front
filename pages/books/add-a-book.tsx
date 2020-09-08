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
import { useDispatch, useSelector } from 'react-redux';
import { addABookRequest } from 'redux/actions/book';
import { RootState } from 'redux/reducers';
import { authLogout } from 'redux/actions/auth';

// todo this page needs to be protected
const AddABook: NextPage = (): JSX.Element => {
  // todo we will need to change the userName when we are able to add user data
  const dispatch = useDispatch();
  const [files, setFiles] = useState<File>();
  const handleFileClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    // todo check for the file size, we do not want to upload any image larger than 5mb
    setFiles(e.target.files?.[0]);
  };

  const { name: userName } = useSelector((store: RootState) => store.user);
  const token = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.token,
  );
  const { notifications } = useSelector((store: RootState) => store.notifications);

  const isSignedIn = Boolean(token);

  return (
    <>
      <NavBar
        userName={userName}
        isSignedIn={isSignedIn}
        notifications={notifications}
        logoutFunc={() => dispatch(authLogout())}
      />
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
                if (isSignedIn && userName) {
                  dispatch(
                    addABookRequest(
                      bookname,
                      bookauthor,
                      files,
                      userName,
                      setSubmitting,
                    ),
                  );
                }
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
