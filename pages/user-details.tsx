import { NextPage } from 'next';
import { Input } from 'components/Input';
import { DateInput } from 'components/DateInput';
import { RadioInput } from 'components/RadioInput';
import { Label as FormHeading } from 'components/Label';
import { RadioSelect } from 'components/RadioSelect';
import { CenterContainer } from 'components/CenterContainer';
import { Button } from '../components/Button';
import { Formik, Form } from 'formik';
import Logo from 'assets/Logo';
import * as Yup from 'yup';

const UserDetails: NextPage = (): JSX.Element => {
  return (
    <CenterContainer withPageContainer containerWidth={400}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Logo width={200} />
      </div>
      <Formik
        initialValues={{
          username: '',
          dob: '',
          sex: '',
        }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          dob: Yup.string().required('Required'),
          sex: Yup.string().required('Required'),
        })}
        onSubmit={({ username, dob, sex }, { setSubmitting }) => {
          console.log(username, dob, sex);
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
          <DateInput name="dob" labelText="Date of Birth" isRequired />
          {/* <FormHeading labelText="Sex" labelAtTop isRequired as="div">
            <div style={{ marginTop: '1rem' }}>
              <RadioInput name="sex" labelText="Female" />
              <RadioInput name="sex" labelText="Male" />
            </div>
          </FormHeading> */}
          <RadioSelect
            name="sex"
            options={[
              { value: 'male', labelText: 'Male' },
              { value: 'female', labelText: 'Female' },
            ]}
          />
          <Button color="dark" type="submit" fontMedium asButtonTag>
            Submit
          </Button>
        </Form>
      </Formik>
    </CenterContainer>
  );
};

export default UserDetails;
