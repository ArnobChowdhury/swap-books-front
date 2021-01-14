import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Input } from 'components/Input';
import { DateInput } from 'components/DateInput';
import { RadioSelect } from 'components/RadioSelect';
import { CenterContainer } from 'ui-kits/CenterContainer';
import { Button } from 'ui-kits/Button';
import { Spinner } from 'ui-kits/Spinner';
import { Formik, Form } from 'formik';
import { Logo } from 'assets/Logo';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createUserReq } from 'redux/actions/user';
import { RootState } from 'redux/reducers';

const UserDetails: NextPage = (): JSX.Element => {
  const userCreationOnGoing = useSelector(
    (s: RootState) => s.user.userCreationOnGoing,
  );
  const userHasBeenCreated = useSelector(
    (s: RootState) => s.user.userCreationSuccessful,
  );

  const router = useRouter();

  useEffect(() => {
    if (userHasBeenCreated) {
      router.push('/');
    }
  }, [userHasBeenCreated]);

  const dispatch = useDispatch();

  return (
    <CenterContainer withPageContainer containerWidth={400}>
      {userCreationOnGoing && <Spinner />}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Logo width={200} />
      </div>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          dob: '',
          sex: '',
        }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          dob: Yup.string().required('Required'),
          sex: Yup.string().required('Required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string()
            .required('Password needed')
            .min(8, 'Too short. Needs to have min. 8 characters')
            .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
        })}
        onSubmit={({ username, email, password, dob, sex }, { setSubmitting }) => {
          dispatch(
            createUserReq(username, email, password, dob, sex, setSubmitting),
          );
        }}
      >
        <Form>
          <Input
            name="username"
            labelText="Username"
            type="text"
            labelAtTop
            isRequired
            inputFieldFullWidth
          />
          <Input
            name="email"
            labelText="Email"
            type="email"
            labelAtTop
            isRequired
            inputFieldFullWidth
          />
          <Input
            name="password"
            labelText="Password"
            type="password"
            labelAtTop
            isRequired
            inputFieldFullWidth
          />
          <Input
            name="confirmPassword"
            labelText="Confirm Password"
            type="password"
            labelAtTop
            isRequired
            inputFieldFullWidth
          />
          <DateInput name="dob" labelText="Date of Birth" isRequired />
          <RadioSelect
            name="sex"
            options={[
              { value: 'male', labelText: 'Male' },
              { value: 'female', labelText: 'Female' },
            ]}
          />
          <Button color="pink" type="submit" asButtonTag>
            Submit
          </Button>
        </Form>
      </Formik>
    </CenterContainer>
  );
};

export default UserDetails;
