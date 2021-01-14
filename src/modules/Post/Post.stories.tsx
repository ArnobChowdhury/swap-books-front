import { Post, PostProps } from './Post';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Post',
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
    bottomMargin: {
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
      ],
    },
  },
} as Meta;

export const Template: Story<PostProps> = (props: PostProps) => {
  return <Post {...props} />;
};