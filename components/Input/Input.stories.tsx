import React from 'react';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { decorate } from '@storybook/addon-actions';
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
  const placeholder = text('placeholder', 'Placeholder');
  const type = select('type', ['text', 'email', 'password'], 'text');
  const isFullWidth = boolean('isFullWidth', false);

  const [value, setValue] = React.useState('');

  const updateValueState = (
    args: React.FormEvent<HTMLInputElement>[],
  ): React.FormEvent<HTMLInputElement>[] => {
    setValue(args[0].currentTarget.value);
    console.log(args[0]);
    return args;
  };

  const decorateActions = decorate([updateValueState]);

  return (
    <Input
      value={value}
      placeholder={placeholder}
      type={type}
      isFullWidth={isFullWidth}
      onChange={decorateActions.action('onChange')}
    />
  );
};
