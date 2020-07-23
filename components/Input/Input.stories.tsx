import React from 'react';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';
import { Input } from './Input';
import InputBox from '../InputBox';
import { withA11y } from '@storybook/addon-a11y';
import { decorate } from '@storybook/addon-actions';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

export default {
  title: 'Input',
  component: Input,
  subcomponents: { InputBox },
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Text, Email, Password Inputs',
    backgrounds: [{ name: 'Yellow', value: theme.colorYellowDeep, default: true }],
  },
};

export const Default = (): JSX.Element => {
  const [value, setValue] = React.useState('');

  const updateValueState = (
    args: React.FormEvent<HTMLInputElement>[],
  ): React.FormEvent<HTMLInputElement>[] => {
    setValue(args[0].currentTarget.value);
    return args;
  };

  const decorateActions = decorate([updateValueState]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
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
              name={select('type', ['text', 'email', 'password'], 'email')}
              labelText={text('labelText', 'Email')}
              type={select('type', ['text', 'email', 'password'], 'email')}
              value={value}
              placeholder={text('placeholder', 'example@domain.com')}
              onChangeFunc={decorateActions.action('onChange')}
              inputFieldFullWidth={boolean('inputFieldFullWidth', false)}
              isRequired={boolean('isRequired', false)}
              labelAtTop={boolean('labelAtTop', false)}
            />
          </Form>
        </Formik>
      </ThemeProvider>
    </>
  );
};
