import { IconButton, IconButtonProps } from './IconButton';
import { withA11y } from '@storybook/addon-a11y';
import { Story, Meta } from '@storybook/react';
import { InterestIcon } from '../../assets/InterestIcon';

export default {
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    icon: {
      defaultValue: <InterestIcon hasBodyColor />,
    },
    textColor: {
      control: {
        type: 'select',
        options: ['primary', 'secondary'],
      },
      defaultValue: 'secondary',
    },
    buttonText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Express Interest',
    },
    fontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
  },
} as Meta;

export const Template: Story<IconButtonProps> = (props: IconButtonProps) => {
  return (
    <>
      <IconButton {...props}>Express Interest</IconButton>
    </>
  );
};
