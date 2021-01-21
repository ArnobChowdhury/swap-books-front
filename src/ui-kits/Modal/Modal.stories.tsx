import { Modal, ModalProps } from './Modal';
import { FlexContainer } from '../FlexContainer';
import { FlexItem } from '../FlexItem';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'ui-kits/Modal',
  component: Modal,
} as Meta;

export const Template: Story<ModalProps> = (props: ModalProps): JSX.Element => {
  return (
    <>
      <Modal {...props}>
        <FlexContainer direction="column" spacing={15}>
          <FlexItem>Totally random things</FlexItem>
          <FlexItem>Somethings totally random</FlexItem>
        </FlexContainer>
      </Modal>
    </>
  );
};
