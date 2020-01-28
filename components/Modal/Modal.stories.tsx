import { withKnobs } from '@storybook/addon-knobs';
import Modal from './Modal';
import FlexContainer from '../FlexContainer';
import FlexItem from '../FlexItem';
import Input from '../Input';
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
    backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <Modal onClick={action('onClick')}>
          <FlexContainer direction="column" spacing={15}>
            <FlexItem>
              <Input
                type="email"
                labelText="Email:"
                value=""
                placeholder="Please type your email address"
                inputFieldFullWidth={true}
                isRequired={true}
              />
            </FlexItem>
            <FlexItem>
              <Input
                type="password"
                labelText="Password"
                value=""
                placeholder="Choose a strong password"
                inputFieldFullWidth={true}
                isRequired={true}
              />
            </FlexItem>
          </FlexContainer>
        </Modal>
      </ThemeProvider>
    </>
  );
};
