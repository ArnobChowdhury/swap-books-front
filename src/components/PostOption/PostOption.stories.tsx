import { PostOptionProps, PostOption } from './PostOption';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/PostOption',
  component: PostOption,
  argTypes: {
    options: {
      defaultValue: [
        {
          name: 'Edit',
          onClick: () => {
            /** */
          },
        },
      ],
    },
  },
} as Meta;

export const Template: Story<PostOptionProps> = (props: PostOptionProps) => {
  return (
    <>
      <PostOption {...props} />
    </>
  );
};
