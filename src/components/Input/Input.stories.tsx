import React from 'react';
import { Input, InputProps } from './Input';
import { InputBox } from 'ui-kits/InputBox';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/Input',
  component: Input,
  subcomponents: { InputBox },
  argTypes: {
    labelText: {
      control: {
        type: 'text',
      },
      defaultValue: 'First Name',
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'firstName',
    },
    type: {
      control: {
        type: 'text',
        options: ['text', 'email', 'password'],
      },
      defaultValue: 'text',
    },
    value: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    placeholder: {
      control: {
        type: 'text',
      },
      defaultValue: 'Your first name',
    },
    inputFieldFullWidth: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    isRequired: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    labelAtTop: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    labelMinWidth: {
      control: {
        type: 'text',
      },
      defaultValue: '200px',
    },
    marginBottom: {
      control: {
        type: 'text',
      },
      defaultValue: '20px',
    },
    autoFocus: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

export const Default: Story<InputProps> = (props: InputProps): JSX.Element => {
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
          <Input {...props} />
        </Form>
      </Formik>
    </>
  );
};
