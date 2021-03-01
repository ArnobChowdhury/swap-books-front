import {
  InterestButtonSmall,
  InterestButtonSmallProps,
} from './InterestButtonSmall';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/InterestButtonSmall',
  component: InterestButtonSmall,
  argTypes: {
    isSelected: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    requestOnGoing: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

export const Template: Story<InterestButtonSmallProps> = (
  props: InterestButtonSmallProps,
) => {
  return <InterestButtonSmall {...props} />;
};
