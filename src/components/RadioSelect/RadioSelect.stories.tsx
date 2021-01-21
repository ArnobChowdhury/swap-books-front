import { RadioSelect } from './RadioSelect';
import { Form, Formik } from 'formik';

export default {
  title: 'components/RadioSelect',
  component: RadioSelect,
};

export const Default = (): JSX.Element => {
  return (
    <Formik
      initialValues={{
        sex: '',
      }}
      onSubmit={() => {
        /** */
      }}
    >
      <Form>
        <RadioSelect
          name="sex"
          options={[
            { value: 'male', labelText: 'Male' },
            { value: 'female', labelText: 'Female' },
          ]}
        />
      </Form>
    </Formik>
  );
};
