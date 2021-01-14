import { Spinner } from './Spinner';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Spinner',
  component: Spinner,
  parameters: {
    componentSubtitle: 'Spinner',
    backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
} as Meta;

export const Template: Story = (): JSX.Element => {
  return <Spinner />;
};
