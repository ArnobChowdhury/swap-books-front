import { RequestResult, RequestResultProps } from './RequestResult';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'components/RequestResult',
  component: RequestResult,
  argTypes: {
    msg: {
      control: {
        type: 'text',
      },
      defaultValue: 'Book Added Successfully',
    },
    reqStatus: {
      control: {
        type: 'text',
      },
      defaultValue: 'success',
    },
  },
} as Meta;

export const Template: Story<RequestResultProps> = (props: RequestResultProps) => {
  return (
    <>
      <RequestResult {...props} />
    </>
  );
};
