import { NavBar, NavBarProps } from './NavBar';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Navbar',
  component: NavBar,
  argTypes: {
    userName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Arnob',
    },
    isSignedIn: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    currentSelected: {
      control: {
        type: 'text',
        options: ['Books', 'Messages', 'Notifications', 'User', 'Auth'],
      },
    },
    notifications: {
      defaultValue: [
        {
          notificationId: '5f515f79d18fed82f7cdf334',
          fromId: '5f4d1486c4fe82826769f1d5',
          fromName: "ma'name",
          toId: '5f2cf359d581ac22e4626a8a',
          bookId: '5f2d36fd34f95632229f0354',
          bookName: 'Inferno',
          type: 'interest',
          seen: false,
        },
        {
          notificationId: '5f521a776b9cf4ce0a0f6ccf',
          fromId: '5f4d1486c2fe32866769f1d5',
          fromName: 'Romeo',
          toId: '5f2cf359d581ac22e4626a8a',
          bookId: '5f2d369d30f95632229f0354',
          bookName: 'Magic',
          type: 'interest',
          seen: false,
        },
        {
          notificationId: '5f521a776b9cf4ce0a0f6cd0',
          fromId: '5f4d1426c2fe3486976901d5',
          fromName: 'Ahsan',
          toId: '5f2cf359d581ac22e4626a8a',
          bookId: '5f2d969d20895682289f0354',
          bookName: 'Tring Tring',
          type: 'interest',
          seen: false,
        },
        {
          notificationId: '5f521a776b9cf4ce0a0f6cd1',
          fromId: '8f4df426c2ae3486976901d2',
          fromName: 'Ahsan',
          toId: '5f2cf359d581ac22e4626a8a',
          bookId: '5f2d169d20895662289f0354',
          bookName: 'Baby Zinc',
          type: 'interest',
          seen: false,
        },
        {
          notificationId: '5f521a776b9cf4ce0a0f6cd2',
          fromId: '1f4d2426527e3488978901d2',
          fromName: 'Adeeb',
          toId: '5f2cf359d581ac22e4626a8a',
          bookId: '2f2d161d20897663289f0359',
          bookName: 'Diaper',
          type: 'interest',
          seen: false,
        },
      ],
    },
  },
} as Meta;

export const Template: Story<NavBarProps> = (props: NavBarProps) => {
  return <NavBar {...props} />;
};
