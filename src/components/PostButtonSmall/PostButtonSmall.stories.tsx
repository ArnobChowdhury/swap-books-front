import { PostButtonSmall, PostButtonSmallProps } from './PostButtonSmall';
import { Story, Meta } from '@storybook/react';
import { InterestIcon } from 'assets/InterestIcon';

export default {
  title: 'components/PostButtonSmall',
  component: PostButtonSmall,
  argTypes: {
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

export const Template: Story<PostButtonSmallProps> = (
  props: PostButtonSmallProps,
) => {
  return (
    <PostButtonSmall
      icon={<InterestIcon width="40" height="40" lightBorder />}
      {...props}
    />
  );
};
