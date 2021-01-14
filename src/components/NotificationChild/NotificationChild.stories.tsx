import { NotificationChild, NotificationChildProps } from './NotificationChild';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'NotificationChild',
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
    bookName: {
      control: {
        type: 'text',
      },
      defaultValue: 'Amazing',
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

export const Match = (): JSX.Element => {
  return (
    <NotificationChild
      seen={false}
      fromId="1233355"
      fromName="Shakhawat"
      bookName="Amazing"
      type="match"
      roomLink="1233425adas121"
    />
  );
};
