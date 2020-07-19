import { NextPage } from 'next';
import { Input } from 'components/Input';
import { DateInput } from 'components/DateInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const UserDetails: NextPage = (): JSX.Element => {
  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          dob: '',
        }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          password: Yup.string()
            .required('Password needed')
            .min(8, 'Too short. Needs to have min. 8 characters')
            .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
        })}
        onSubmit={({ username }, { setSubmitting }) => {
          username;
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
        </Form>
      </Formik>
    </div>
  );
};

export default UserDetails;
