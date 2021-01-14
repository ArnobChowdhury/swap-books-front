import { Button, ButtonProps } from './Button';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: ['white', 'pink'],
      },
      defaultValue: 'pink',
    },
    asButtonTag: {
      control: {
        type: 'boolean',
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['submit', 'reset', 'button'],
      },
    },
    href: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta;

export const Template: Story<ButtonProps> = (props: ButtonProps) => {
  return (
    <>
      <Button {...props}>Sign up</Button>
    </>
  );
};
