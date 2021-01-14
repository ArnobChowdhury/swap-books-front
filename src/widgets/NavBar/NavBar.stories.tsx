import { NavBar } from './NavBar';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'NavBar',
  component: NavBar,
} as Meta;

export const Template: Story = props => {
  return <NavBar {...props} />;
};
