import { withKnobs } from '@storybook/addon-knobs';
import { Modal } from './Modal';
import { FlexContainer } from '../FlexContainer';
import { FlexItem } from '../FlexItem';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';

export default {
  title: 'Modal',
  component: Modal,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'A simple component to use as Modal',
    // backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <Modal onClick={action('onClick')}>
          <FlexContainer direction="column" spacing={15}>
            <FlexItem>Totally random things</FlexItem>
            <FlexItem>Somethings totally random</FlexItem>
          </FlexContainer>
        </Modal>
      </ThemeProvider>
    </>
  );
};
