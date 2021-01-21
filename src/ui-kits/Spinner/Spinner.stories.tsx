import { Spinner } from './Spinner';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'ui-kits/Spinner',
  component: Spinner,
} as Meta;

export const Template: Story = (): JSX.Element => {
  return <Spinner />;
};
