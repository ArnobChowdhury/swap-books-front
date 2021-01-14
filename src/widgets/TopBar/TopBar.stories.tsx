import { TopBar } from './TopBar';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'TopBar',
  component: TopBar,
} as Meta;

export const Template: Story = () => {
  return <TopBar />;
};
