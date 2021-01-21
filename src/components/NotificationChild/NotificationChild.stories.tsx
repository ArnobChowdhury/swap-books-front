import { NotificationChild, NotificationChildProps } from './NotificationChild';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/NotificationChild',
  component: NotificationChild,
  argTypes: {
    seen: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    fromId: {
      control: {
        type: 'text',
      },
      defaultValue: '123456',
    },
    fromName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Arnob',
    },
    bookNames: {
      defaultValue: ['Amazing', 'The Sealed Nectar'],
    },
    type: {
      control: {
        type: 'text',
        options: ['interest', 'match'],
      },
      defaultValue: 'interest',
    },
  },
} as Meta;

export const Interest: Story<NotificationChildProps> = (
  props: NotificationChildProps,
): JSX.Element => {
  return <NotificationChild {...props} />;
};

export const Match = Interest.bind({});
Match.args = {
  seen: true,
  fromId: '12345',
  fromName: 'Shakhawat',
  bookNames: ['Amazing', 'The book thief'],
  ownersBookInterests: ['Uponnash Troyee', 'Kalo Haat - Tin goyenda'],
  type: 'match',
  roomLink: '12343525321',
};
