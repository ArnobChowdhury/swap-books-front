import { DateInput, DateInputProps } from './DateInput';
import { Story, Meta } from '@storybook/react';
import { Formik, Form } from 'formik';

export default {
  title: 'components/DateInput',
  component: DateInput,
  argTypes: {
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'dob',
    },
    value: {
      control: {
        type: 'text',
      },
      defaultValue: '12-12-2020',
    },
    labelText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Date of Birth',
    },
    marginBottom: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isRequired: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

export const Template: Story<DateInputProps> = (
  props: DateInputProps,
): JSX.Element => {
  return (
    <Formik
      initialValues={{ date: '' }}
      onSubmit={() => {
        /** */
      }}
    >
      <Form>
        <DateInput {...props} />;
      </Form>
    </Formik>
  );
};
