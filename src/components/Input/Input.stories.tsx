import React from 'react';
import { Input } from './Input';
import { InputBox } from 'ui-kits/InputBox';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

export default {
  title: 'Input',
  component: Input,
  subcomponents: { InputBox },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string()
            .required('Password needed')
            .min(8, 'Too short. Needs to have min. 8 characters')
            .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
        })}
        onSubmit={({ email, password }, { setSubmitting }) => {
          email;
          password;
          setSubmitting;
        }}
      >
        <Form>
          <Input
            name="email"
            labelText="Email"
            type="email"
            value="xy@xy.com"
            placeholder="example@domain.com"
            onChangeFunc={() => {
              /** */
            }}
            inputFieldFullWidth={false}
            isRequired={false}
            labelAtTop={false}
          />
        </Form>
      </Formik>
    </>
  );
};
