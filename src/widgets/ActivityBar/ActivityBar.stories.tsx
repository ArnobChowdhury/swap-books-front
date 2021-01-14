import { ActivityBar } from './ActivityBar';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'ActivityBar',
  component: ActivityBar,
  argTypes: {},
} as Meta;

export const Template: Story = props => {
  return <ActivityBar {...props} />;
};
