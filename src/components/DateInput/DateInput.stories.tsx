import { DateInput, DateInputProps } from './DateInput';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'DateInput',
  component: DateInput,
} as Meta;

export const Template: Story<DateInputProps> = (
  props: DateInputProps,
): JSX.Element => {
  return <DateInput {...props} />;
};
