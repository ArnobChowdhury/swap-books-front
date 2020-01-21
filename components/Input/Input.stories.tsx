import React from 'react';
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs';
import Input from './Input';
import { withA11y } from '@storybook/addon-a11y';
import { decorate } from '@storybook/addon-actions';

export default {
  title: 'Input',
  component: Input,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Controlled text input component with label',
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
    <Input
      labelText={text('labelText', 'Email:')}
      type={select('type', ['text', 'email', 'password'], 'email')}
      value={value}
      placeholder={text('placeholder', 'example@domain.com')}
      onChangeFunc={decorateActions.action('onChange')}
      inputFieldFullWidth={boolean('inputFieldFullWidth', false)}
      isRequired={boolean('isRequired', false)}
      labelAtTop={boolean('labelAtTop', false)}
    />
  );
};
