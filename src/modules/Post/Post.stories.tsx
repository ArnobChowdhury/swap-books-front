import { Post, PostProps } from './Post';
import { PostShimmer } from './PostShimmer';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Modules/Post',
  component: Post,
  argTypes: {
    imgUrl: {
      control: {
        type: 'text',
      },
      defaultValue: 'https://eloquentjavascript.net/img/cover.jpg',
    },
    bookName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Eloquent Javascript',
    },
    bookAuthor: {
      control: {
        type: 'text',
      },
      defaultValue: 'Marijn Haverbeke',
    },
    bookOwnerName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Arnob Chowdhury',
    },
    isInterested: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    topMargin: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    interestReqOnGoing: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    key: {
      control: {
        type: 'text',
      },
      defaultValue: '1sasd1adfaslk',
    },
    isOwners: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    postOptions: {
      defaultValue: [
        {
          name: 'Edit',
          onClick: () => {
            /** */
          },
        },
        {
          name: 'Make available for another 10 days',
          onClick: () => {
            /** */
          },
        },
      ],
    },
    validTill: {
      defaultValue: '2021-04-22T12:12:25.762Z',
    },
  },
} as Meta;

export const Default: Story<PostProps> = (props: PostProps) => {
  return <Post {...props} />;
};

export const Shimmer: Story<PostProps> = () => {
  return <PostShimmer />;
};
