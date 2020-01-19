import React from 'react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import Input from './Input';

export default {
  title: 'Input',
  component: Input,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Text, Email or Password Inputs',
  },
};

export const Default = (): JSX.Element => {
  const value = text('value', '');
  const placeholder = text('placeholder', 'Placeholder');
  const type = select('type', ['text', 'email', 'password'], 'text');
  return <Input value={value} placeholder={placeholder} type={type} />;
};
