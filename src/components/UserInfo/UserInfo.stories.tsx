import { UserInfo, UserInfoProps } from './UserInfo';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/UserInfo',
  component: UserInfo,
  argTypes: {
    userName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Sam',
    },
    numOfAvailableBooks: {
      control: {
        type: 'number',
      },
      defaultValue: 5,
    },
    numOfBooksSwapped: {
      control: {
        type: 'number',
      },
      defaultValue: 5,
    },
  },
} as Meta;

export const Template: Story<UserInfoProps> = (props: UserInfoProps) => {
  return <UserInfo {...props} />;
};
