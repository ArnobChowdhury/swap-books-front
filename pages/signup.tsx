import { useState } from 'react';
import { NextPage } from 'next';
import { Input } from 'components/Input';
import { DateInput } from 'components/DateInput';
import { RadioSelect } from 'components/RadioSelect';
import { CenterContainer } from 'components/CenterContainer';
import { Button } from '../components/Button';
import { Formik, Form } from 'formik';
import Logo from 'assets/Logo';
import * as Yup from 'yup';

const UserDetails: NextPage = (): JSX.Element => {
  const [locationObj, setLocationObj] = useState<Position>();

  const handleGeoLocation = () => {
    if (process.browser) {
      navigator.geolocation.getCurrentPosition(setLocationObj, console.log);
    }
  };

  return (
    <CenterContainer withPageContainer containerWidth={400}>
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
        onSubmit={({ username, dob, sex, email, password }, { setSubmitting }) => {
          console.log(username, dob, sex, email, password, locationObj);
          // username;
          setSubmitting;
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
          <div>
            <button
              onClick={handleGeoLocation}
              style={{
                marginBottom: '20px',
                fontFamily: 'inherit',
                padding: '10px',
                cursor: 'pointer',
                borderRadius: '5px',
                border: '1px solid rgb(150,150,150)',
              }}
            >
              Click this to allow access to location info. Why? We cannot show you
              swappable books in you area without your location information.
            </button>
          </div>
          <Button color="dark" type="submit" fontMedium asButtonTag>
            Submit
          </Button>
        </Form>
      </Formik>
    </CenterContainer>
  );
};

export default UserDetails;
