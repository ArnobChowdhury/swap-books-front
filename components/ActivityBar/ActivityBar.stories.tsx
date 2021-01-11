import { ActivityBar, ActivityBarProps } from './ActivityBar';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'ActivityBar',
  component: ActivityBar,
  argTypes: {},
} as Meta;

export const Template: Story<ActivityBarProps> = (props: ActivityBarProps) => {
  return <ActivityBar {...props} />;
};
